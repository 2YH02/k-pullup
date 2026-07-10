import type { User } from "@/types/user";

export const SESSION_CACHE_KEY = "k-pullup-user-cache";

/**
 * sessionStorage에서 캐싱된 User 객체를 조회한다.
 * JSON 파싱 실패 또는 userId 필드 누락 시 캐시를 삭제하고 null을 반환한다.
 */
export const getSessionCache = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "userId" in parsed &&
      typeof (parsed as Record<string, unknown>).userId === "number"
    ) {
      return parsed as User;
    }

    // userId 필드가 없으면 캐시 삭제
    sessionStorage.removeItem(SESSION_CACHE_KEY);
    return null;
  } catch {
    // 파싱 실패 시 캐시 삭제
    sessionStorage.removeItem(SESSION_CACHE_KEY);
    return null;
  }
};

/**
 * User 객체를 JSON 직렬화하여 sessionStorage에 저장한다.
 */
export const setSessionCache = (user: User): void => {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(user));
};

/**
 * sessionStorage에서 캐싱된 사용자 정보를 삭제한다.
 */
export const clearSessionCache = (): void => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem(SESSION_CACHE_KEY);
};
