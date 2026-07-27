import { readFileSync } from "fs";
const src = readFileSync("client/src/pages/Areas.tsx", "utf8");
const names = [...src.matchAll(/districts:\s*\[([\s\S]*?)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1])
);
console.log("REGIONS 地區總數:", names.length);
const dd =
  readFileSync("client/src/lib/districtData.ts", "utf8") +
  readFileSync("client/src/lib/districtData2.ts", "utf8");
const slugNames = [...new Set([...dd.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]))];
console.log("著陸頁地區:", slugNames.join(","));
const missing = slugNames.filter((n) => names.includes(n) === false);
console.log(
  "著陸頁地區未列於分區清單:",
  missing.length ? missing.join(",") : "無（全部可被搜尋到）"
);
// 檢查 DISTRICT_SLUGS 對照鍵是否與著陸頁地區一致
const ddMain = readFileSync("client/src/lib/districtData.ts", "utf8");
const slugMap = ddMain.match(/DISTRICT_SLUGS[\s\S]*?\{([\s\S]*?)\}/);
if (slugMap) {
  const keys = [...slugMap[1].matchAll(/["']?([\u4e00-\u9fff]+)["']?\s*:/g)].map((m) => m[1]);
  console.log("DISTRICT_SLUGS 鍵:", keys.join(","));
}
