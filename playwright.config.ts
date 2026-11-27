import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end and accessibility tests. They run against a production build
 * (`npm run build` first), so behavior and bundle sizes match what ships.
 */
const PORT = Number(process.env.E2E_PORT ?? 3200);

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
    env: { ...(process.env as Record<string, string>), RESEND_API_KEY: "", MAILPIT_URL: "", EMAIL_FROM: "" },
  },
});
