// Regenerates src/design/tokens.css from src/design/tokens.ts.
// Run: npm run tokens -w @agentpay/web
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { tokenCSS } from "../src/design/tokens.ts";

const target = fileURLToPath(new URL("../src/design/tokens.css", import.meta.url));
writeFileSync(target, `${tokenCSS}\n`);
console.log(`Wrote ${target}`);
