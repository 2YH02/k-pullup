import { describe, it, expect, afterEach, vi } from "vitest";
import { getApiBase } from "@lib/api-base";

/**
 * getApiBase: 실행 컨텍스트별 API 베이스 URL
 *
 * - 서버(window 없음): NEXT_PUBLIC_BASE_URL, 미설정/빈 문자열이면 기본값
 * - 클라이언트(window 있음): Next.js rewrite 경로 "/api/v1"
 */

const DEFAULT_BASE = "https://api.k-pullup.com/api/v1";

describe("getApiBase", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("서버", () => {
    it("NEXT_PUBLIC_BASE_URL 이 있으면 그 값을 사용한다", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://staging.example.com/api/v1");

      expect(getApiBase()).toBe("https://staging.example.com/api/v1");
    });

    it("NEXT_PUBLIC_BASE_URL 이 없으면 기본값을 사용한다", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", undefined);

      expect(getApiBase()).toBe(DEFAULT_BASE);
    });

    it("NEXT_PUBLIC_BASE_URL 이 빈 문자열이면 기본값을 사용한다", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "");

      expect(getApiBase()).toBe(DEFAULT_BASE);
    });
  });

  describe("클라이언트", () => {
    it("환경변수와 무관하게 rewrite 경로를 사용한다", () => {
      vi.stubGlobal("window", {});
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://staging.example.com/api/v1");

      expect(getApiBase()).toBe("/api/v1");
    });
  });
});
