import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { controlThemes, themes, tokenCSS } from "./tokens";

// Vitest stubs CSS imports, so read the real files from disk.
const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");
const tokensCss = read("./tokens.css");
const componentCss = [
  "../components/ui/controls.css",
  "../components/ui/loading.css",
].map(read);

// Supplied at runtime by React Aria popovers, not by the design tokens.
const runtimeVariables = new Set(["--trigger-width", "--available-height"]);

describe("design tokens", () => {
  it("keeps the generated stylesheet in sync with tokens.ts", () => {
    // Regenerate with: npm run tokens -w @agentpay/web
    expect(tokensCss.replace(/\r\n/g, "\n").trim()).toBe(tokenCSS.trim());
  });

  it("defines every alias for both themes", () => {
    for (const theme of ["dark", "light"]) {
      const block = tokensCss
        .split(`[data-snapp-theme="${theme}"] {`)[1]
        ?.split("}")[0];
      expect(block).toBeDefined();
      for (const [name] of [...themes, ...controlThemes])
        expect(block).toContain(`--${name}:`);
    }
  });

  it("defines every variable that reusable component styles consume", () => {
    const defined = new Set(
      [...tokensCss.matchAll(/(--[a-z0-9-]+):/g)].map((match) => match[1]),
    );
    const used = componentCss.flatMap((css) =>
      [...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((match) => match[1]),
    );
    const missing = [...new Set(used)].filter(
      (name) => !defined.has(name) && !runtimeVariables.has(name),
    );
    expect(missing).toEqual([]);
  });
});
