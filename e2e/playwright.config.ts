import { defineConfig, devices } from '@playwright/test'

// Drives the LIVE deployed app (E2E_BASE_URL), set by the CI e2e job to
// https://flights.proappstore.online. Run locally against a preview build with:
//   (cd web && npx vite build && npx vite preview --port 4173) &
//   E2E_BASE_URL=http://localhost:4173 npx playwright test
export default defineConfig({
  testDir: './specs',
  timeout: 45000,
  expect: { timeout: 15000 },
  retries: 1,
  forbidOnly: true,
  reporter: [['github'], ['list'], ['json', { outputFile: 'results.json' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
