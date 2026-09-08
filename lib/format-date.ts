export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);

  // API 는 UTC ISO 문자열을 반환하므로, UTC getter 로 포매팅하면 KST 새벽
  // (00:00~08:59) 게시물이 하루 전으로 표시된다. SSR(UTC 서버)/CSR 양쪽에서
  // 동일한 결과를 내기 위해 Asia/Seoul 타임존으로 고정한다. (P3-1)
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}.${get("month")}.${get("day")}`;
};
