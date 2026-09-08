const minutesAgo = (dateString: string | Date) => {
  const pastDate: Date = new Date(dateString);
  const now: Date = new Date();

  // 클라이언트 시계가 서버보다 느리면 diff 가 음수가 되어 "-1분 전" 이 표시된다.
  // 0 미만으로 내려가지 않도록 clamp 한다. (P3-2)
  const diffMs: number = Math.max(0, now.getTime() - pastDate.getTime());

  const totalMinutes: number = Math.floor(diffMs / (1000 * 60));

  const hours: number = Math.floor(totalMinutes / 60);
  const minutes: number = totalMinutes % 60;

  return { hours, minutes };
};

export default minutesAgo;
