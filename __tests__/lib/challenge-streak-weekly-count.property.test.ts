import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { getWeeklyAchievedCount, getCurrentWeekDays } from "@lib/challenge-streak";
import type { VisitRecord } from "@lib/challenge-storage";

/**
 * Property 6: Weekly achieved count accuracy
 *
 * For any set of visit records and any reference date, the weekly achieved count
 * should equal the number of unique dates in the records that fall within the
 * Monday-to-Sunday range containing the reference date.
 *
 * **Validates: Requirements 4.1, 4.5**
 */
describe("Feature: challenge-local-streak, Property 6: Weekly achieved count accuracy", () => {
  /** Format a Date object to "YYYY-MM-DD" */
  const formatDate = (d: Date): string => {
    const year = String(d.getFullYear()).padStart(4, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /** Arbitrary that generates a "YYYY-MM-DD" date string */
  const dateArb = fc.date({
    min: new Date(2020, 0, 1),
    max: new Date(2030, 11, 31),
  }).map(formatDate);

  /** Arbitrary that generates an array of VisitRecords with unique dates */
  const uniqueRecordsArb = fc
    .uniqueArray(dateArb, { minLength: 0, maxLength: 30 })
    .chain((dates) =>
      fc.tuple(
        fc.constant(dates),
        fc.array(fc.integer({ min: 1, max: 10 }), {
          minLength: dates.length,
          maxLength: dates.length,
        })
      )
    )
    .map(([dates, counts]): VisitRecord[] =>
      dates.map((date, i) => ({ date, count: counts[i] }))
    );

  it("weekly achieved count equals the number of records with dates in the current Mon-Sun range", () => {
    fc.assert(
      fc.property(
        uniqueRecordsArb,
        dateArb,
        (records, today) => {
          const result = getWeeklyAchievedCount(records, today);

          // Oracle: get the Mon-Sun dates for that week, count how many records have dates in that range
          const weekDays = new Set(getCurrentWeekDays(today));
          const expected = records.filter((r) => weekDays.has(r.date)).length;

          expect(result).toBe(expected);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("returns 0 when no records fall within the reference week", () => {
    fc.assert(
      fc.property(
        dateArb,
        (today) => {
          // Empty records should always give 0
          const result = getWeeklyAchievedCount([], today);
          expect(result).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("returns at most 7 for any input since a week has at most 7 days", () => {
    fc.assert(
      fc.property(
        uniqueRecordsArb,
        dateArb,
        (records, today) => {
          const result = getWeeklyAchievedCount(records, today);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(7);
        }
      ),
      { numRuns: 100 }
    );
  });
});
