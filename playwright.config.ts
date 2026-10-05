import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL ?? "https://local.k-pullup.com:5173",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },

  expect: {
    timeout: 20000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    // mo: (max-width 484px) 반응형 레이아웃 회귀 감지용. CI 에 이미 설치된 chromium 사용.
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
});
