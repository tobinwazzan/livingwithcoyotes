import { defineConfig, devices } from "@playwright/test";

// E2E runs against a deployed URL (local dev can't reach Supabase — the keys
// live only in Vercel). Default to production; override with BASE_URL for a
// preview deploy. Tests create tagged 'zz-e2e-...@example.com' rows; global
// teardown purges them via the pattern-locked purge_e2e_signups RPC.
export default defineConfig({
  testDir: "./e2e",
  globalTeardown: "./e2e/global-teardown.ts",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL || "https://livingwithcoyotes.org",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
});
