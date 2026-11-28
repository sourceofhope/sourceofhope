import { existsSync, readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
import { parse } from "dotenv";

/**
 * End-to-end and accessibility tests. They run against a production build
 * (`npm run build` first), so behavior and bundle sizes match what ships.
 */
const PORT = Number(process.env.E2E_PORT ?? 3200);

/*
 * The Hub reads events from the database, so the server under test talks to
 * the local Supabase stack (`npm run db:start` locally; CI starts its own).
 * `next start` doesn't load .env.development.local, so pass its database
 * keys through when they aren't already set.
 */
const LOCAL_DB_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const;
const localDb: Record<string, string> = {};
if (existsSync(".env.development.local")) {
  const local = parse(readFileSync(".env.development.local"));
  for (const key of LOCAL_DB_KEYS) if (!process.env[key] && local[key]) localDb[key] = local[key];
}

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Tests never send real email: blank any Resend key a local .env holds
    // (process env wins over .env files), so form submissions take the
    // "couldn't send" path deterministically.
    env: { ...(process.env as Record<string, string>), ...localDb, RESEND_API_KEY: "", MAILPIT_URL: "", EMAIL_FROM: "" },
  },
});
