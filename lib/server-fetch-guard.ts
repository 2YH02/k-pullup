import { FetchError } from "@lib/fetchData";

export type ServerFetchStatus = "ok" | "unauthorized" | "notfound";

export interface ServerFetchResult<T> {
  status: ServerFetchStatus;
  data: T | null;
}

/**
 * 서버 컴포넌트에서 API를 호출할 때 공통으로 사용하는 가드.
 *
 * fetchData 가 non-2xx 에서 FetchError 를 throw 하도록 바뀐 뒤(2026-07-09),
 * 서버 페이지들이 401/404 를 직접 판별하지 못하고 전역 error.tsx 로 떨어지는
 * 문제가 있었다. 이 헬퍼는 401 -> "unauthorized", 404 -> "notfound" 로 분류하고
 * 그 외 에러는 그대로 re-throw 하여 상위 error boundary 가 처리하게 한다.
 *
 * 사용 예:
 *   const { status, data } = await guardServerFetch(() => myInfo(cookie));
 *   if (status === "unauthorized") return <AuthError ... />;
 *   if (status === "notfound") return <NotFound ... />;
 *   // status === "ok" 이면 data 사용
 */
const guardServerFetch = async <T>(
  fetcher: () => Promise<T>
): Promise<ServerFetchResult<T>> => {
  try {
    const data = await fetcher();
    return { status: "ok", data };
  } catch (e) {
    if (e instanceof FetchError) {
      if (e.status === 401 || e.status === 403) {
        return { status: "unauthorized", data: null };
      }
      if (e.status === 404) {
        return { status: "notfound", data: null };
      }
    }
    throw e;
  }
};

export default guardServerFetch;
