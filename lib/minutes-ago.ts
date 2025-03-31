const minutesAgo = (dateString: string | Date) => {
  const pastDate: Date = new Date(dateString);
  const now: Date = new Date();

  const diffMs: number = now.getTime() - pastDate.getTime();

  const totalMinutes: number = Math.floor(diffMs / (1000 * 60));

  const hours: number = Math.floor(totalMinutes / 60);
  const minutes: number = totalMinutes % 60;

  return { hours, minutes };
};

export default minutesAgo;
