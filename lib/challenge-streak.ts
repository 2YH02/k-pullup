import type { VisitRecord } from "@lib/challenge-storage";

// --- Date arithmetic helpers (string-based, no timezone issues) ---

/** Parse "YYYY-MM-DD" into { year, month, day } integers */
const parseDate = (dateStr: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month, day };
};

/** Format { year, month, day } back to "YYYY-MM-DD" */
const formatDate = (year: number, month: number, day: number): string => {
  const y = String(year).padStart(4, "0");
  const m = String(month).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/** Days in a given month (handles leap years) */
const daysInMonth = (year: number, month: number): number => {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2) {
    const isLeap =
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeap ? 29 : 28;
  }
  return monthDays[month - 1];
};

/** Subtract N days from a date string, returning a new date string */
const subtractDays = (dateStr: string, n: number): string => {
  let { year, month, day } = parseDate(dateStr);
  for (let i = 0; i < n; i++) {
    day -= 1;
    if (day < 1) {
      month -= 1;
      if (month < 1) {
        year -= 1;
        month = 12;
      }
      day = daysInMonth(year, month);
    }
  }
  return formatDate(year, month, day);
};

/**
 * Get ISO day of week (1=Monday, 7=Sunday).
 * Uses new Date(year, month-1, day) which is timezone-safe for day-of-week only.
 */
const getIsoDayOfWeek = (dateStr: string): number => {
  const { year, month, day } = parseDate(dateStr);
  const d = new Date(year, month - 1, day);
  const jsDay = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return jsDay === 0 ? 7 : jsDay;
};

// --- Exported pure functions ---

/**
 * 연속 방문 일수 계산.
 * - 오늘 방문 기록이 있으면 오늘부터 역순 카운트
 * - 오늘 기록이 없으면 어제부터 역순 카운트
 * - 연속이 끊기면 0 반환
 */
const calculateStreak = (records: VisitRecord[], today: string): number => {
  const dateSet = new Set(records.map((r) => r.date));

  const hasToday = dateSet.has(today);
  const yesterday = subtractDays(today, 1);
  const hasYesterday = dateSet.has(yesterday);

  if (!hasToday && !hasYesterday) return 0;

  let startDate = hasToday ? today : yesterday;
  let streak = 0;

  while (dateSet.has(startDate)) {
    streak += 1;
    startDate = subtractDays(startDate, 1);
  }

  return streak;
};

/**
 * 히트맵 강도 매핑.
 * 0=미방문, 1=1회, 2=2-3회, 3=4회 이상
 */
const getIntensityLevel = (count: number): 0 | 1 | 2 | 3 => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
};

/**
 * ISO 주 식별자 반환 (e.g., "2024-W03").
 * ISO 8601: 주의 시작은 월요일, 1월 4일을 포함하는 주가 W01.
 */
const getWeekIdentifier = (dateStr: string): string => {
  const { year, month, day } = parseDate(dateStr);
  // Use Date object for ISO week number calculation (timezone-safe with explicit y/m/d)
  const date = new Date(year, month - 1, day);

  // ISO week: Thursday of the current week determines the year
  const thursday = new Date(date);
  thursday.setDate(date.getDate() + (4 - (date.getDay() || 7)));

  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  const isoYear = thursday.getFullYear();
  return `${isoYear}-W${String(weekNumber).padStart(2, "0")}`;
};

/**
 * 현재 주의 월~일 날짜 배열 반환.
 * ISO 8601 기준 주 시작 = 월요일.
 * 배열 순서: 월요일부터 일요일까지 (오름차순).
 */
const getCurrentWeekDays = (today: string): string[] => {
  const dayOfWeek = getIsoDayOfWeek(today); // 1=Mon, 7=Sun
  const daysFromMonday = dayOfWeek - 1;
  const monday = subtractDays(today, daysFromMonday);

  const days: string[] = [];
  let current = monday;
  for (let i = 0; i < 7; i++) {
    days.push(current);
    if (i < 6) {
      // Add one day
      const { year, month, day } = parseDate(current);
      let nextDay = day + 1;
      let nextMonth = month;
      let nextYear = year;
      if (nextDay > daysInMonth(nextYear, nextMonth)) {
        nextDay = 1;
        nextMonth += 1;
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }
      }
      current = formatDate(nextYear, nextMonth, nextDay);
    }
  }

  return days;
};

/**
 * 이번 주 방문 일수 계산.
 * 현재 주(월~일) 범위 내 방문 기록이 있는 고유 날짜 수를 반환.
 */
const getWeeklyAchievedCount = (records: VisitRecord[], today: string): number => {
  const weekDays = new Set(getCurrentWeekDays(today));
  let count = 0;

  for (const record of records) {
    if (weekDays.has(record.date)) {
      count += 1;
    }
  }

  return count;
};

/**
 * 최근 49일(7주) 날짜 배열 반환 (히트맵 렌더링용).
 * 가장 오래된 날짜가 첫 번째, 가장 최근(today)이 마지막.
 * today가 위치한 주의 일요일까지 포함하며, 그 일요일부터 역산하여 49일.
 */
const getHeatmapDates = (today: string): string[] => {
  // 이번 주 일요일 기준으로 49일
  const dayOfWeek = getIsoDayOfWeek(today); // 1=Mon, 7=Sun
  const daysToSunday = 7 - dayOfWeek;
  let endDate = today;
  // Advance to Sunday
  for (let i = 0; i < daysToSunday; i++) {
    const { year, month, day } = parseDate(endDate);
    let nextDay = day + 1;
    let nextMonth = month;
    let nextYear = year;
    if (nextDay > daysInMonth(nextYear, nextMonth)) {
      nextDay = 1;
      nextMonth += 1;
      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }
    }
    endDate = formatDate(nextYear, nextMonth, nextDay);
  }

  // Start from 48 days before endDate (total 49 days)
  const startDate = subtractDays(endDate, 48);

  const dates: string[] = [];
  let current = startDate;
  for (let i = 0; i < 49; i++) {
    dates.push(current);
    if (i < 48) {
      const { year, month, day } = parseDate(current);
      let nextDay = day + 1;
      let nextMonth = month;
      let nextYear = year;
      if (nextDay > daysInMonth(nextYear, nextMonth)) {
        nextDay = 1;
        nextMonth += 1;
        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }
      }
      current = formatDate(nextYear, nextMonth, nextDay);
    }
  }

  return dates;
};

export {
  calculateStreak,
  getIntensityLevel,
  getWeekIdentifier,
  getCurrentWeekDays,
  getWeeklyAchievedCount,
  getHeatmapDates,
};
