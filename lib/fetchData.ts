export class FetchError extends Error {
  readonly status: number;
  readonly url: string;
  readonly responseBody: string | null;

  constructor(
    status: number,
    url: string,
    message: string,
    responseBody?: string | null
  ) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.url = url;
    this.responseBody = responseBody ?? null;
  }
}

const getErrorMessage = (status: number, url: string): string => {
  if (status === 401) {
    return `${status} 인증 실패: 로그인이 필요합니다. (${url})`;
  }
  if (status === 403) {
    return `${status} 권한 없음: 접근이 거부되었습니다. (${url})`;
  }
  if (status === 404) {
    return `${status} 리소스를 찾을 수 없습니다. (${url})`;
  }
  if (status === 429) {
    return `${status} 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요. (${url})`;
  }
  if (status >= 400 && status < 500) {
    return `클라이언트 오류 ${status}: (${url})`;
  }
  if (status >= 500 && status < 600) {
    return `서버 오류 ${status}: (${url})`;
  }
  return `HTTP 오류 ${status}: (${url})`;
};

const fetchData = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new FetchError(0, url, "네트워크 오류: 서버에 연결할 수 없습니다.");
  }

  if (response.ok) {
    return response;
  }

  let responseBody: string | null = null;
  try {
    responseBody = await Promise.race([
      response.text(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
    ]);
  } catch {
    responseBody = null;
  }

  const message = getErrorMessage(response.status, url);
  throw new FetchError(response.status, url, message, responseBody);
};

export { getErrorMessage };
export default fetchData;
