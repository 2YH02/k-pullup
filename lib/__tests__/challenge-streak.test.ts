import { describe, it, expect } from "vitest";
import {
  calculateStreak,
  getIntensityLevel,
  getWeekIdentifier,
  getCurrentWeekDays,
  getWeeklyAchievedCount,
  getHeatmapDates,
} from "@lib/challenge-streak";
import type { VisitRecord } from "@lib/challenge-storage";

describe("calculateStreak", () => {
  it("returns 0 when no records exist", () => {
    expect(calculateStreak([], "2024-01-15")).toBe(0);
  });

  it("returns 1 when only today has a record", () => {
    const records: VisitRecord[] = [{ date: "2024-01-15", count: 1 }];
    expect(calculateStreak(records, "2024-01-15")).toBe(1);
  });

  it("counts consecutive days backward from today", () => {
    const records: VisitRecord[] = [
      { date: "2024-01-15", count: 1 },
      { date: "2024-01-14", count: 2 },
      { date: "2024-01-13", count: 1 },
    ];
    expect(calculateStreak(records, "2024-01-15")).toBe(3);
  });

  it("counts from yesterday if today has no record", () => {
    const records: VisitRecord[] = [
      { date: "2024-01-14", count: 1 },
      { date: "2024-01-13", count: 1 },
    ];
    expect(calculateStreak(records, "2024-01-15")).toBe(2);
  });

  it("returns 0 if neither today nor yesterday has a record", () => {
    const records: VisitRecord[] = [{ date: "2024-01-12", count: 1 }];
    expect(calculateStreak(records, "2024-01-15")).toBe(0);
  });

  it("handles month boundary correctly", () => {
    const records: VisitRecord[] = [
      { date: "2024-02-01", count: 1 },
      { date: "2024-01-31", count: 1 },
      { date: "2024-01-30", count: 1 },
    ];
    expect(calculateStreak(records, "2024-02-01")).toBe(3);
  });

  it("handles year boundary correctly", () => {
    const records: VisitRecord[] = [
      { date: "2024-01-01", count: 1 },
      { date: "2023-12-31", count: 1 },
      { date: "2023-12-30", count: 1 },
    ];
    expect(calculateStreak(records, "2024-01-01")).toBe(3);
  });
});

describe("getIntensityLevel", () => {
  it("returns 0 for no visits", () => {
    expect(getIntensityLevel(0)).toBe(0);
  });

  it("returns 1 for 1 visit", () => {
    expect(getIntensityLevel(1)).toBe(1);
  });

  it("returns 2 for 2-3 visits", () => {
    expect(getIntensityLevel(2)).toBe(2);
    expect(getIntensityLevel(3)).toBe(2);
  });

  it("returns 3 for 4+ visits", () => {
    expect(getIntensityLevel(4)).toBe(3);
    expect(getIntensityLevel(10)).toBe(3);
  });
});

describe("getWeekIdentifier", () => {
  it("returns correct ISO week identifier", () => {
    // 2024-01-15 is Monday of W03
    expect(getWeekIdentifier("2024-01-15")).toBe("2024-W03");
  });

  it("handles year boundary (late Dec may be W01 of next year)", () => {
    // 2024-12-30 is Monday of W01 of 2025
    expect(getWeekIdentifier("2024-12-30")).toBe("2025-W01");
  });

  it("handles year start (Jan 1 may be in previous year's last week)", () => {
    // 2024-01-01 is a Monday → W01 of 2024
    expect(getWeekIdentifier("2024-01-01")).toBe("2024-W01");
  });
});

describe("getCurrentWeekDays", () => {
  it("returns 7 days from Monday to Sunday", () => {
    // 2024-01-15 is a Monday
    const days = getCurrentWeekDays("2024-01-15");
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2024-01-15"); // Monday
    expect(days[6]).toBe("2024-01-21"); // Sunday
  });

  it("returns correct week when today is Wednesday", () => {
    // 2024-01-17 is Wednesday
    const days = getCurrentWeekDays("2024-01-17");
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2024-01-15"); // Monday
    expect(days[6]).toBe("2024-01-21"); // Sunday
  });

  it("returns correct week when today is Sunday", () => {
    // 2024-01-21 is Sunday
    const days = getCurrentWeekDays("2024-01-21");
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2024-01-15"); // Monday
    expect(days[6]).toBe("2024-01-21"); // Sunday
  });
});

describe("getWeeklyAchievedCount", () => {
  it("returns 0 when no records in current week", () => {
    const records: VisitRecord[] = [{ date: "2024-01-08", count: 1 }];
    // 2024-01-15 week is Jan 15-21
    expect(getWeeklyAchievedCount(records, "2024-01-15")).toBe(0);
  });

  it("counts unique days with records in current week", () => {
    const records: VisitRecord[] = [
      { date: "2024-01-15", count: 3 },
      { date: "2024-01-16", count: 1 },
      { date: "2024-01-18", count: 2 },
    ];
    expect(getWeeklyAchievedCount(records, "2024-01-17")).toBe(3);
  });

  it("does not count records from other weeks", () => {
    const records: VisitRecord[] = [
      { date: "2024-01-14", count: 1 }, // previous week (Sunday)
      { date: "2024-01-15", count: 1 }, // current week (Monday)
      { date: "2024-01-22", count: 1 }, // next week (Monday)
    ];
    expect(getWeeklyAchievedCount(records, "2024-01-17")).toBe(1);
  });
});

describe("getHeatmapDates", () => {
  it("returns exactly 49 dates", () => {
    const dates = getHeatmapDates("2024-01-17");
    expect(dates).toHaveLength(49);
  });

  it("last date is the Sunday of the current week", () => {
    // 2024-01-17 is Wednesday; Sunday is 2024-01-21
    const dates = getHeatmapDates("2024-01-17");
    expect(dates[48]).toBe("2024-01-21");
  });

  it("first date is a Monday (start of 7th week back)", () => {
    const dates = getHeatmapDates("2024-01-17");
    // 49 days ending on Sunday 2024-01-21, so starts on 2023-12-04 (Monday)
    expect(dates[0]).toBe("2023-12-04");
  });

  it("all dates are in ascending order", () => {
    const dates = getHeatmapDates("2024-06-15");
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] > dates[i - 1]).toBe(true);
    }
  });

  it("includes today when today is Sunday", () => {
    // 2024-01-21 is Sunday
    const dates = getHeatmapDates("2024-01-21");
    expect(dates[48]).toBe("2024-01-21");
  });
});
