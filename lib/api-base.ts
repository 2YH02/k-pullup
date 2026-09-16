/**
 * API 베이스 URL 공통 상수
 *
 * - 서버(SSR/RSC): NEXT_PUBLIC_BASE_URL 환경변수를 사용
 * - 클라이언트: Next.js rewrite(/api/v1/*) 경로를 사용
 *
 * AGENTS.md 4조: 서버 실행 컨텍스트에서만 NEXT_PUBLIC_BASE_URL 직접 사용을 허용한다.
 */
export const getApiBase = (): string => {
  const isServer = typeof window === "undefined";
  return isServer
    ? (process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.k-pullup.com/api/v1")
    : "/api/v1";
};
