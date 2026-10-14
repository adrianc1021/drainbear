import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { parseEnv } from "node:util";

// A cloud binding takes precedence; an ignored local file supports this workspace.
let key = process.env.API_KEY_21ST;
if (!key) {
  try {
    const local = await readFile(
      new URL("../../../../.env.local", import.meta.url),
      "utf8"
    );
    key = parseEnv(local).API_KEY_21ST;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
if (!key) {
  process.stderr.write(
    "21st MCP requires API_KEY_21ST in environment settings or .env.local.\n"
  );
  process.exit(1);
}

const proxy = spawn(
  "npx",
  ["--yes", "--package", "@21st-dev/magic@0.2.3", "magic"],
  {
    env: { ...process.env, NODE_USE_ENV_PROXY: "1", API_KEY_21ST: key },
    stdio: "inherit",
  }
);
proxy.on("error", () => {
  process.stderr.write("Unable to start the official 21st MCP proxy.\n");
  process.exit(1);
});
proxy.on("exit", code => process.exit(code ?? 1));
process.on("SIGTERM", () => proxy.kill("SIGTERM"));
process.on("SIGINT", () => proxy.kill("SIGINT"));
