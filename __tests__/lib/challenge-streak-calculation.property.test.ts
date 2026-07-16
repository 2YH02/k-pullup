import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateStreak } from "@lib/challenge-streak";
import type { VisitRecord } from "@lib/challenge-storage";

/**
 * Property 3: Streak calculation correctness
 *
 * For any set of visit records with unique date keys and any reference date,
 * the calculated streak should equal the length of the longest unbroken chain
 * of consecutive calendar days ending at the reference date (if visited) or
 * the day before (if not visited), and should be 0 if neither today nor
 * yesterday has a record.
 *
 * **Validates: Requirements 2.1, 2.2, 2.3**
 */

/** Subtract one day from a YYYY-MM-DD string (timezone-safe) */
const subtractOneDay = (dateStr: string): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d - 1); // subtracting one day
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/** Oracle: compute expected streak from a set of date strings and a reference date */
const computeExpectedStreak = (
  dateSet: Set<string>,
  today: string
): number => {
  const yesterday = subtractOneDay(today);

  if (!dateSet.has(today) && !dateSet.has(yesterday)) {
    return 0;
  }

  const startDate = dateSet.has(today) ? today : yesterday;
  let streak = 0;
  let current = startDate;

  while (dateSet.has(current)) {
    streak += 1;
    current = subtractOneDay(current);
  }

  return streak;
};

describe("Feature: challenge-local-streak, Property 3: Streak calculation correctness", () => {
  it("should calculate streak equal to the longest unbroken consecutive chain ending at today or yesterday", () => {
    fc.assert(
      fc.property(
        // Generate year/month/day for a valid reference date
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
        // Generate a set of unique date offsets relative to today (days to subtract)
        fc.uniqueArray(fc.integer({ min: 0, max: 60 }), {
          minLength: 0,
          maxLength: 30,
        }),
        (year, month, day, offsets) => {
          const today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          // Build visit records from offsets (each offset = days before today)
          const records: VisitRecord[] = offsets.map((offset) => {
            let dateStr = today;
            for (let i = 0; i < offset; i++) {
              dateStr = subtractOneDay(dateStr);
            }
            return { date: dateStr, count: 1 };
          });

          // Build a date set for oracle calculation
          const dateSet = new Set(records.map((r) => r.date));

          // Compute expected streak using oracle
          const expected = computeExpectedStreak(dateSet, today);

          // Verify calculateStreak matches
          const actual = calculateStreak(records, today);

          expect(actual).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should return 0 when neither today nor yesterday has a record", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
        // Generate offsets that are all >= 2 (no today or yesterday)
        fc.uniqueArray(fc.integer({ min: 2, max: 60 }), {
          minLength: 0,
          maxLength: 20,
        }),
        (year, month, day, offsets) => {
          const today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const records: VisitRecord[] = offsets.map((offset) => {
            let dateStr = today;
            for (let i = 0; i < offset; i++) {
              dateStr = subtractOneDay(dateStr);
            }
            return { date: dateStr, count: 1 };
          });

          const actual = calculateStreak(records, today);
          expect(actual).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should count from today when today has a record", () => {
    fc.assert(
      fc.property(
        // Generate year/month/day integers for a valid date
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }), // max 28 to avoid month-end issues
        // Generate a consecutive chain length starting from today
        fc.integer({ min: 1, max: 30 }),
        (year, month, day, chainLength) => {
          const today = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          // Build a perfect consecutive chain from today backward
          const records: VisitRecord[] = [];
          let dateStr = today;
          for (let i = 0; i < chainLength; i++) {
            records.push({ date: dateStr, count: 1 });
            if (i < chainLength - 1) {
              dateStr = subtractOneDay(dateStr);
            }
          }

          const actual = calculateStreak(records, today);
          expect(actual).toBe(chainLength);
        }
      ),
      { numRuns: 100 }
    );
  });
});
