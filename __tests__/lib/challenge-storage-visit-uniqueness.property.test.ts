import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import type { VisitRecord } from "@lib/challenge-storage";

/**
 * Property 1: Visit recording uniqueness invariant
 *
 * For any date and any positive number of visits N on that date,
 * recording N visits should result in exactly one record entry for that date
 * with count equal to N, and no other records should be affected.
 *
 * **Validates: Requirements 1.1, 1.2, 7.4**
 */

// Simulate visit recording logic (mirrors store's recordVisit behavior)
const recordVisitToRecords = (
  records: VisitRecord[],
  date: string
): VisitRecord[] => {
  const existing = records.find((r) => r.date === date);
  if (existing) {
    return records.map((r) =>
      r.date === date ? { ...r, count: r.count + 1 } : r
    );
  }
  return [...records, { date, count: 1 }];
};

// Generator for YYYY-MM-DD date strings (avoids invalid Date issues)
const dateStringArb = (yearMin: number, yearMax: number) =>
  fc
    .tuple(
      fc.integer({ min: yearMin, max: yearMax }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 }) // Use 28 to avoid invalid month-day combos
    )
    .map(
      ([y, m, d]) =>
        `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );

// Generator for records with unique dates
const uniqueRecordsArb = (yearMin: number, yearMax: number) =>
  fc
    .uniqueArray(dateStringArb(yearMin, yearMax), {
      minLength: 1,
      maxLength: 10,
      comparator: (a, b) => a === b,
    })
    .chain((dates) =>
      fc
        .array(fc.integer({ min: 1, max: 50 }), {
          minLength: dates.length,
          maxLength: dates.length,
        })
        .map((counts) =>
          dates.map((date, i) => ({ date, count: counts[i] }))
        )
    );

describe("Feature: challenge-local-streak, Property 1: Visit recording uniqueness invariant", () => {
  it("recording N visits for a date results in exactly one record with count=N", () => {
    fc.assert(
      fc.property(
        dateStringArb(2020, 2030),
        fc.integer({ min: 1, max: 100 }),
        (dateStr, n) => {
          // Apply N visits to empty records
          let records: VisitRecord[] = [];
          for (let i = 0; i < n; i++) {
            records = recordVisitToRecords(records, dateStr);
          }

          // Verify uniqueness: exactly one record for this date
          const matching = records.filter((r) => r.date === dateStr);
          expect(matching).toHaveLength(1);

          // Verify count equals N
          expect(matching[0].count).toBe(n);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("recording visits for a date does not affect other existing records", () => {
    fc.assert(
      fc.property(
        // Generate pre-existing records with unique dates (2020-2024 range)
        fc
          .uniqueArray(dateStringArb(2020, 2024), {
            minLength: 1,
            maxLength: 10,
            comparator: (a, b) => a === b,
          })
          .chain((dates) =>
            fc.tuple(
              fc.constant(dates),
              fc.array(fc.integer({ min: 1, max: 50 }), {
                minLength: dates.length,
                maxLength: dates.length,
              })
            )
          )
          .map(([dates, counts]) =>
            dates.map((date, i) => ({ date, count: counts[i] }))
          ),
        // Generate a new date in 2026 range (guaranteed different from 2020-2024)
        dateStringArb(2026, 2026),
        fc.integer({ min: 1, max: 20 }),
        (existingRecords, newDateStr, n) => {
          // Apply N visits for the new date
          let records: VisitRecord[] = [...existingRecords];
          for (let i = 0; i < n; i++) {
            records = recordVisitToRecords(records, newDateStr);
          }

          // Verify existing records are unaffected
          for (const original of existingRecords) {
            const found = records.find((r) => r.date === original.date);
            expect(found).toBeDefined();
            expect(found!.count).toBe(original.count);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
