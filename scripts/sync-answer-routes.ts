/** Explicit editorial maintenance, never invoked by a production build. */
import fs from "node:fs/promises";
import { ANSWER_ROUTES } from "../shared/drainAnswers";
async function main() {
  await fs.writeFile(
    "shared/drainAnswerRoutes.json",
    JSON.stringify(ANSWER_ROUTES, null, 2) + "\n"
  );
  console.log(`Saved ${ANSWER_ROUTES.length} answer routes`);
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
