import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3200",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "rm -f e2e.db e2e.db-shm e2e.db-wal && TURSO_DATABASE_URL=file:e2e.db npx drizzle-kit push --force && TURSO_DATABASE_URL=file:e2e.db ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=e2e-password-12345 ADMIN_SESSION_SECRET=e2e-session-secret-123456789012345 npm start -- -p 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
