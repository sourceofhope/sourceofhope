import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  // `server-only` throws outside a React Server Component bundle; tests
  // import server modules directly, so stub it.
  "server-only": fileURLToPath(new URL("./test/stubs/server-only.ts", import.meta.url)),
};

// Every date in the product is shown in Central time; run tests in a
// different zone so a missing timeZone option fails loudly.
const env = { TZ: "UTC" };

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          include: ["src/**/*.test.ts", "eslint/**/*.test.ts"],
          environment: "node",
          env,
        },
      },
      {
        resolve: { alias },
        test: {
          name: "components",
          include: ["src/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["./test/setup-dom.ts"],
          // next-intl imports `next/navigation` without an extension; let Vite
          // resolve it the way Next.js does.
          server: { deps: { inline: ["next-intl"] } },
          env,
        },
      },
    ],
  },
});
