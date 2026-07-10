"use client";

import myInfo from "@api/user/myInfo";
import { FetchError } from "@lib/fetchData";
import {
  clearSessionCache,
  getSessionCache,
  setSessionCache,
} from "@lib/session-cache";
import useUserStore from "@store/useUserStore";
import { useEffect } from "react";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const setIsLoading = useUserStore((state) => state.setIsLoading);

  // mount-only effect: 인증 상태 부트스트랩은 마운트 시 1회만 실행한다.
  // setUser, setIsLoading은 Zustand selector로 참조 안정성이 보장되므로 deps에서 제외해도 안전하다.
  useEffect(() => {
    const bootstrap = async () => {
      // 1. sessionStorage에서 캐시 복원 시도
      const cached = getSessionCache();
      const hasCached = cached !== null;

      if (hasCached) {
        // 캐시 유효 시 즉시 setUser → setIsLoading(false)
        setUser(cached);
        setIsLoading(false);
      }

      // 2. 백그라운드(또는 포그라운드) 서버 검증
      try {
        const user = await myInfo();
        setUser(user);
        setSessionCache(user);
      } catch (error) {
        if (error instanceof FetchError && error.status === 401) {
          // 401: 정상적인 비로그인 상태 — 콘솔 미출력
          setUser(null);
          clearSessionCache();
        } else {
          // 기타 에러: console.warn, 캐시 유지
          console.warn(error);
          if (!hasCached) {
            setUser(null);
          }
        }
      } finally {
        // 캐시 없을 때만 여기서 isLoading을 false로 전환
        // (캐시 있을 때는 이미 위에서 false로 설정됨)
        if (!hasCached) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};

export default UserProvider;
