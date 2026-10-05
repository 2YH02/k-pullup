import { test, expect } from "@playwright/test";

const MOCK_MARKERS = [
  { markerId: 9001, address: "서울특별시 중구 <mark>세종대로</mark> 110" },
  { markerId: 9002, address: "서울특별시 종로구 <mark>세종대로</mark> 175" },
];

test.describe("검색 페이지 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/v1/search/marker?**", async (route) => {
      const term = new URL(route.request().url()).searchParams.get("term");
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          took: 1,
          markers: term === "세종대로" ? MOCK_MARKERS : [],
        }),
      });
    });

    await page.goto("/search");
    await page.waitForLoadState("load");
  });

  test("검색어 입력 시 철봉 위치 결과가 표시됨", async ({ page }) => {
    await page.getByPlaceholder("철봉 위치 주소로 검색").fill("세종대로");

    await expect(page.getByText("철봉 위치", { exact: true })).toBeVisible();
    await expect(page.getByText("서울특별시 중구 세종대로 110")).toBeVisible();
    await expect(page.getByText("서울특별시 종로구 세종대로 175")).toBeVisible();
  });

  test("결과 클릭 시 상세 페이지로 이동하고 최근 검색에 markerId 로 저장됨", async ({
    page,
  }) => {
    await page.getByPlaceholder("철봉 위치 주소로 검색").fill("세종대로");
    await page.getByText("서울특별시 중구 세종대로 110").click();

    await expect(page).toHaveURL(/\/pullup\/9001$/);

    const history = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("search-history") ?? "{}")
    );
    expect(history.version).toBe(1);
    expect(history.state.searches[0]).toMatchObject({ markerId: 9001 });
    expect(history.state.searches[0]).not.toHaveProperty("d");
  });

  test("결과가 없으면 빈 상태 문구가 표시됨", async ({ page }) => {
    await page.getByPlaceholder("철봉 위치 주소로 검색").fill("zzqx없는주소qxzz");

    await expect(page.getByText("검색 결과가 없습니다")).toBeVisible();
    await expect(page.getByText("철봉 위치", { exact: true })).not.toBeVisible();
  });
});
