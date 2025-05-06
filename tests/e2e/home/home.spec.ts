import { test, expect } from "@playwright/test";

test.describe("메인 페이지 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
  });

  test("타이틀 확인", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("대한민국 철봉 지도");
  });
});
