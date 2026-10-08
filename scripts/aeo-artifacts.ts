import fs from "node:fs/promises";
import path from "node:path";

export interface AeoSnapshot {
  route: string;
  url: string;
  title: string;
  description: string;
  language: string;
  robots: string;
  text: string;
  ids: string[];
  links: string[];
  structuredData: unknown[];
  phoneDisplay?: string;
}

type Node = Record<string, unknown>;
const normalize = (value: string) => value.replace(/\s+/g, "");

export function graphNodes(values: unknown[]): Node[] {
  return values.flatMap(value => {
    if (Array.isArray(value)) return graphNodes(value);
    if (!value || typeof value !== "object") return [];
    const node = value as Node;
    return Array.isArray(node["@graph"])
      ? [node, ...graphNodes(node["@graph"])]
      : [node];
  });
}

export function buildAeoArtifacts(
  snapshots: AeoSnapshot[],
  siteUrl: string,
  generatedAt = new Date().toISOString()
) {
  const origin = new URL(siteUrl).origin;
  const eligible = snapshots.filter(
    snapshot =>
      !/\bnoindex\b/i.test(snapshot.robots) &&
      snapshot.url === new URL(snapshot.route, `${origin}/`).href
  );
  if (new Set(eligible.map(page => page.url)).size !== eligible.length)
    throw new Error("AEO index contains duplicate canonical URLs");

  const home = eligible.find(page => page.route === "/");
  if (!home) throw new Error("AEO index requires an indexable homepage");
  const homeNodes = graphNodes(home.structuredData);
  const organization = homeNodes.find(
    node => node["@id"] === `${origin}/#organization`
  );
  if (
    !organization ||
    typeof organization.name !== "string" ||
    typeof organization.telephone !== "string"
  )
    throw new Error("AEO index requires resolved public business metadata");
  if (
    home.phoneDisplay &&
    normalize(home.phoneDisplay).replace(/\D/g, "") !==
      organization.telephone.replace(/\D/g, "")
  )
    throw new Error("AEO business telephone differs from the visible homepage");

  const pages = eligible.map(snapshot => {
    const nodes = graphNodes(snapshot.structuredData);
    const visible = normalize(snapshot.text);
    const answers = nodes
      .filter(node => node["@type"] === "FAQPage")
      .flatMap(node => {
        const questions = Array.isArray(node.mainEntity) ? node.mainEntity : [];
        return questions.map((question: Node) => {
          const answer = question.acceptedAnswer as Node | undefined;
          if (
            typeof question.name !== "string" ||
            typeof answer?.text !== "string" ||
            !visible.includes(normalize(question.name)) ||
            !visible.includes(normalize(answer.text))
          )
            throw new Error(
              `AEO answer is absent from visible HTML: ${snapshot.route}`
            );
          const source =
            typeof question.url === "string" ? question.url : snapshot.url;
          const sourceUrl = new URL(source);
          if (
            sourceUrl.origin !== origin ||
            sourceUrl.pathname !== new URL(snapshot.url).pathname ||
            (sourceUrl.hash && !snapshot.ids.includes(sourceUrl.hash.slice(1)))
          )
            throw new Error(
              `AEO answer has an invalid source anchor: ${source}`
            );
          const citations =
            typeof answer.citation === "string" ? [answer.citation] : [];
          for (const citation of citations)
            if (!snapshot.links.includes(citation))
              throw new Error(
                `AEO citation is absent from visible links: ${citation}`
              );
          return {
            question: question.name,
            answer: answer.text,
            source,
            citations,
          };
        });
      });
    const datedNode = nodes.find(node => typeof node.dateModified === "string");
    return {
      url: snapshot.url,
      title: snapshot.title,
      description: snapshot.description,
      language: snapshot.language,
      ...(datedNode ? { modifiedAt: datedNode.dateModified } : {}),
      text: snapshot.text,
      answers,
      links: Array.from(new Set(snapshot.links)).filter(link =>
        link.startsWith(`${origin}/`)
      ),
      structuredData: snapshot.structuredData,
    };
  });

  const companyPage = eligible.find(page => page.route === "/about");
  if (
    companyPage &&
    (!companyPage.ids.includes("company-facts") ||
      !normalize(companyPage.text).includes(
        normalize(organization.name as string)
      ) ||
      !companyPage.text
        .replace(/\D/g, "")
        .includes((organization.telephone as string).replace(/\D/g, "")))
  )
    throw new Error("AEO company facts differ from their visible source");
  const groupedAnswers = new Map<
    string,
    { question: string; variants: (typeof pages)[number]["answers"] }
  >();
  for (const page of pages)
    for (const answer of page.answers) {
      const key = normalize(answer.question);
      const group = groupedAnswers.get(key) ?? {
        question: answer.question,
        variants: [],
      };
      if (
        !group.variants.some(
          item => item.answer === answer.answer && item.source === answer.source
        )
      )
        group.variants.push(answer);
      groupedAnswers.set(key, group);
    }
  const knowledge = {
    format: "drainbear-public-knowledge/1",
    generatedAt,
    siteUrl: `${origin}/`,
    organization,
    ...(companyPage
      ? {
          companyFacts: {
            source: `${origin}/about#company-facts`,
            name: organization.name,
            telephone: organization.telephone,
            website: `${origin}/`,
            sameAs: organization.sameAs,
          },
        }
      : {}),
    answerCatalog: Array.from(groupedAnswers.values()),
    coverage: {
      indexablePages: pages.length,
      answers: pages.reduce((count, page) => count + page.answers.length, 0),
      uniqueQuestions: groupedAnswers.size,
    },
    pages,
  };
  const qualification =
    "服務方法、上門時間及報價按實際現場與當時安排確認。引用時保留原頁的適用範圍與限制；此索引不代表任何排名、推薦或引用保證。";
  const contact = `查詢電話：${home.phoneDisplay || organization.telephone}`;
  const introduction = `# ${organization.name}\n\n> ${organization.description || home.description}\n\n${contact}\n\n${qualification}\n`;
  const index = `${introduction}\n## 官方公開內容\n\n${pages.map(page => `- [${page.title}](${page.url}): ${page.description}`).join("\n")}\n\n## 可讀取的資料\n\n- [完整公開文字及答案](${origin}/llms-full.txt)\n- [結構化公開資料](${origin}/knowledge.json)\n- [Sitemap](${origin}/sitemap.xml)\n\n引用時請使用每題的來源連結，保留原頁顯示的更新日期及服務限制。生成時間只代表索引建置時間，不能當成每篇文章的更新日期。\n`;
  const full = `${introduction}\n${pages.map(page => `## ${page.title}\n\n來源：${page.url}\n${page.modifiedAt ? `頁面更新：${page.modifiedAt}\n` : ""}\n${page.text}\n\n${page.answers.map(answer => `### ${answer.question}\n\n${answer.answer}\n\n來源：${answer.source}${answer.citations.length ? `\n相關資料：${answer.citations.join(" · ")}` : ""}\n`).join("\n")}`).join("\n")}\n`;
  return { knowledge, index, full };
}

export async function writeAeoArtifacts(
  snapshots: AeoSnapshot[],
  siteUrl: string,
  outputRoot: string
) {
  const result = buildAeoArtifacts(snapshots, siteUrl);
  await fs.writeFile(
    path.join(outputRoot, "knowledge.json"),
    JSON.stringify(result.knowledge, null, 2) + "\n"
  );
  await fs.writeFile(path.join(outputRoot, "llms.txt"), result.index);
  await fs.writeFile(path.join(outputRoot, "llms-full.txt"), result.full);
  console.log(
    `Built AEO index: ${result.knowledge.coverage.indexablePages} pages, ${result.knowledge.coverage.answers} visible answers.`
  );
}
