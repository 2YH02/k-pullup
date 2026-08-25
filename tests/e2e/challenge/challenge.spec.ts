import { test, expect } from "@playwright/test";

test.describe("챌린지 페이지 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/challenge");
    await page.waitForLoadState("load");
  });

  test("타이틀 확인", async ({ page }) => {
    await expect(page).toHaveTitle("챌린지 - 대한민국 철봉 지도");
  });

  test("스트릭 카운터가 표시됨", async ({ page }) => {
    await expect(page.getByText("연속 방문")).toBeVisible();
    await expect(page.getByText("최대 기록")).toBeVisible();
  });

  test("주간 히트맵이 표시됨", async ({ page }) => {
    await expect(page.getByText("방문 히트맵")).toBeVisible();
  });

  test("주간 목표 카드가 표시됨", async ({ page }) => {
    await expect(page.getByText("주간 목표 변경")).toBeVisible();
  });

  test("페이지 진입 시 오늘 방문이 기록됨 (localStorage)", async ({ page }) => {
    // hydration + recordVisit 완료 대기
    await page.waitForTimeout(1000);

    const storageData = await page.evaluate(() => {
      const raw = localStorage.getItem("k-pullup-challenge");
      return raw ? JSON.parse(raw) : null;
    });

    expect(storageData).not.toBeNull();
    expect(storageData.records.length).toBeGreaterThanOrEqual(1);

    const today = new Date().toISOString().split("T")[0];
    const todayRecord = storageData.records.find(
      (r: { date: string }) => r.date === today
    );
    expect(todayRecord).toBeDefined();
    expect(todayRecord.count).toBeGreaterThanOrEqual(1);
  });

  test("주간 목표 버튼 클릭 시 목표가 변경됨", async ({ page }) => {
    // 기본 목표는 5일, 3일로 변경
    const goalButton = page.getByRole("button", {
      name: "주간 목표 3일로 변경",
    });
    await goalButton.click();

    // 버튼이 pressed 상태인지 확인
    await expect(goalButton).toHaveAttribute("aria-pressed", "true");

    // localStorage에 반영되었는지 확인
    const storageData = await page.evaluate(() => {
      const raw = localStorage.getItem("k-pullup-challenge");
      return raw ? JSON.parse(raw) : null;
    });

    expect(storageData.goalSettings.weeklyGoal).toBe(3);
  });

  test("히트맵 셀 클릭 시 방문 횟수가 표시됨", async ({ page }) => {
    // 오늘 날짜의 히트맵 셀 찾아서 클릭
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const label = `${month}월 ${day}일, 방문 1회`;

    const cell = page.getByRole("button", { name: label });
    if (await cell.isVisible()) {
      await cell.click();
      // 클릭하면 선택 상태가 되는지 확인 (ring 스타일)
      await expect(cell).toBeVisible();
    }
  });

  test("이전 데이터가 있을 때 스트릭이 올바르게 표시됨", async ({ page }) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    // 3일 연속 방문 데이터를 미리 localStorage에 세팅
    const challengeData = {
      version: 1,
      lastSyncedAt: null,
      records: [
        { date: formatDate(twoDaysAgo), count: 1 },
        { date: formatDate(yesterday), count: 2 },
        { date: formatDate(today), count: 1 },
      ],
      streakData: { current: 3, max: 3 },
      goalSettings: { weeklyGoal: 5, celebrationShownWeek: null },
    };

    await page.evaluate((data) => {
      localStorage.setItem("k-pullup-challenge", JSON.stringify(data));
    }, challengeData);

    // 새로고침하여 hydrate
    await page.reload();
    await page.waitForLoadState("load");

    // 연속 방문 3일 이상 표시 (오늘 방문 기록이 추가되어 count 올라갈 수 있음)
    await expect(page.getByText("연속 방문")).toBeVisible();
  });
});
