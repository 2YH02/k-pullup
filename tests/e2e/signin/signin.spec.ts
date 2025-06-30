import { test, expect } from "@playwright/test";

test.describe("로그인 페이지 테스트", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/signin/email");
    await page.waitForLoadState("load");
  });

  test("타이틀 확인", async ({ page }) => {
    await expect(page).toHaveTitle("로그인 - 대한민국 철봉 지도");
  });

  test("이메일 입력: 유효하지 않은 이메일일 때 에러 메시지 노출", async ({
    page,
  }) => {
    await page.getByLabel("이메일").fill("invalid-email");
    await page.getByLabel("이메일").blur();

    const errorMessage = page.getByText("이메일 형식을 확인해주세요");
    await expect(errorMessage).toBeVisible();
  });

  test("이메일 입력: 유효한 이메일일 때 에러 메시지가 사라짐", async ({
    page,
  }) => {
    await page.getByLabel("이메일").fill("invalid-email");
    await page.getByLabel("이메일").blur();

    const errorMessage = page.getByText("이메일 형식을 확인해주세요");
    await expect(errorMessage).toBeVisible();

    await page.getByLabel("이메일").fill("valid@email.com");
    await page.getByLabel("이메일").blur();

    await expect(errorMessage).not.toBeVisible();
  });

  test("비밀번호 입력: 유효하지 않은 비밀번호일 때 에러 메시지 노출", async ({
    page,
  }) => {
    await page.getByLabel("비밀번호").fill("short"); // 너무 짧고 숫자 없음
    await page.getByLabel("비밀번호").blur();

    const errorMessage = page.getByText(
      "하나 이상의 숫자와 문자를 포함하여 8자 이상으로 작성해주세요."
    );
    await expect(errorMessage).toBeVisible();
  });

  test("비밀번호 입력: 유효한 비밀번호일 때 에러 메시지가 사라짐", async ({
    page,
  }) => {
    await page.getByLabel("비밀번호").fill("short");
    await page.getByLabel("비밀번호").blur();

    const errorMessage = page.getByText(
      "하나 이상의 숫자와 문자를 포함하여 8자 이상으로 작성해주세요."
    );
    await expect(errorMessage).toBeVisible();

    await page.getByLabel("비밀번호").fill("valid1234");
    await page.getByLabel("비밀번호").blur();

    await expect(errorMessage).not.toBeVisible();
  });

  test("올바른 이메일과 비밀번호 입력 후 로그인 시 마이 페이지로 이동", async ({
    page,
  }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-token",
          user: {
            id: "123",
            email: "valid@email.com",
            nickname: "테스트",
          },
        }),
      });
    });

    await page.getByLabel("이메일").fill("valid@email.com");
    await page.getByLabel("비밀번호").fill("valid1234!");

    const loginButton = page.getByRole("button", { name: "로그인" });
    await expect(loginButton).toBeEnabled();

    await loginButton.click();
    await expect(page).toHaveURL("/mypage");
  });

  test("returnUrl이 포함된 로그인 페이지에서 로그인 시 해당 경로로 리디렉션됨", async ({
    page,
  }) => {
    await page.route("**/api/v1/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-token",
          user: {
            id: "123",
            email: "valid@email.com",
            nickname: "테스트",
          },
        }),
      });
    });

    await page.goto("/signin/email?returnUrl=/register");
    await page.waitForLoadState("load");

    await page.getByLabel("이메일").fill("valid@email.com");
    await page.getByLabel("비밀번호").fill("valid1234!");

    const loginButton = page.getByRole("button", { name: "로그인" });
    await expect(loginButton).toBeEnabled();

    await loginButton.click();
    await expect(page).toHaveURL("/register");
  });

  test("이메일로 회원가입 하기 버튼 클릭 시 약관 동의 창이 나타남", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "이메일로 회원가입 하기" }).click();

    await expect(page.getByText("약관 동의", { exact: true })).toBeVisible();
  });

  test('"비밀번호 초기화하기" 버튼 클릭 시 /reset-password 페이지로 이동', async ({
    page,
  }) => {
    await page.getByRole("button", { name: "비밀번호 초기화하기" }).click();

    await expect(page).toHaveURL("/reset-password");
  });

  test("필수 약관 모두 동의 시 회원가입 버튼이 활성화됨", async ({ page }) => {
    await page.getByRole("button", { name: "이메일로 회원가입 하기" }).click();

    await page.locator('#agree-terms[role="button"]').click();
    await page.locator('#agree-age[role="button"]').click();
    await page.locator('#agree-privacy[role="button"]').click();
    await page.locator('#agree-location[role="button"]').click();

    const signupButton = page.getByRole("button", {
      name: "동의하고 계속하기",
    });
    await expect(signupButton).toBeEnabled();
  });

  test("전체 동의 클릭 시 회원가입 버튼이 활성화됨", async ({ page }) => {
    await page.getByRole("button", { name: "이메일로 회원가입 하기" }).click();

    await page.locator('#agree-all[role="button"]').click();

    const signupButton = page.getByRole("button", {
      name: "동의하고 계속하기",
    });
    await expect(signupButton).toBeEnabled();
  });

  test("필수 약관 일부 누락 시 회원가입 버튼은 비활성화됨", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "이메일로 회원가입 하기" }).click();

    await page.locator('#agree-terms[role="button"]').click();
    await page.locator('#agree-age[role="button"]').click();

    const signupButton = page.getByRole("button", {
      name: "동의하고 계속하기",
    });
    await expect(signupButton).toBeDisabled();
  });
});
