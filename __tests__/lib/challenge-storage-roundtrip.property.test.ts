import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

import type { ChallengeData, VisitRecord, StreakData, GoalSettings } from "@lib/challenge-storage";

/**
 * Property 2: Schema structure round-trip
 *
 * For any valid ChallengeData object, serializing to JSON and deserializing back
 * should produce an equivalent object containing all required fields (version,
 * lastSyncedAt, records, streakData, goalSettings) with correct types, and each
 * record should have a valid ISO 8601 date string and positive integer count.
 *
 * **Validates: Requirements 1.3, 7.1**
 */
describe("Feature: challenge-local-streak, Property 2: Schema structure round-trip", () => {
  // Arbitrary for valid YYYY-MM-DD date strings
  const dateArb = fc
    .tuple(
      fc.integer({ min: 2020, max: 2030 }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 })
    )
    .map(([y, m, d]) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);

  // Arbitrary for VisitRecord
  const visitRecordArb: fc.Arbitrary<VisitRecord> = fc.record({
    date: dateArb,
    count: fc.integer({ min: 1, max: 100 }),
  });

  // Arbitrary for StreakData
  const streakDataArb: fc.Arbitrary<StreakData> = fc
    .tuple(fc.integer({ min: 0, max: 365 }), fc.integer({ min: 0, max: 365 }))
    .map(([current, max]) => ({
      current: Math.min(current, max),
      max: Math.max(current, max),
    }));

  // Arbitrary for ISO week identifier (e.g., "2024-W03")
  const weekIdentifierArb = fc
    .tuple(fc.integer({ min: 2020, max: 2030 }), fc.integer({ min: 1, max: 53 }))
    .map(([y, w]) => `${y}-W${String(w).padStart(2, "0")}`);

  // Arbitrary for GoalSettings
  const goalSettingsArb: fc.Arbitrary<GoalSettings> = fc.record({
    weeklyGoal: fc.integer({ min: 1, max: 7 }),
    celebrationShownWeek: fc.oneof(fc.constant(null), weekIdentifierArb),
  });

  // Arbitrary for ChallengeData
  const challengeDataArb: fc.Arbitrary<ChallengeData> = fc.record({
    version: fc.integer({ min: 1, max: 10 }),
    lastSyncedAt: fc.oneof(
      fc.constant(null),
      fc.date({ min: new Date("2020-01-01"), max: new Date("2030-12-31") }).map((d) => d.toISOString())
    ),
    records: fc.array(visitRecordArb, { minLength: 0, maxLength: 50 }),
    streakData: streakDataArb,
    goalSettings: goalSettingsArb,
  });

  it("serializing to JSON and deserializing back should produce an equivalent object", () => {
    fc.assert(
      fc.property(challengeDataArb, (data) => {
        // Serialize
        const serialized = JSON.stringify(data);

        // Deserialize
        const deserialized = JSON.parse(serialized) as ChallengeData;

        // Verify structural equivalence
        expect(deserialized).toEqual(data);

        // Verify all required top-level fields exist
        expect(deserialized).toHaveProperty("version");
        expect(deserialized).toHaveProperty("lastSyncedAt");
        expect(deserialized).toHaveProperty("records");
        expect(deserialized).toHaveProperty("streakData");
        expect(deserialized).toHaveProperty("goalSettings");

        // Verify correct types for top-level fields
        expect(typeof deserialized.version).toBe("number");
        expect(
          deserialized.lastSyncedAt === null || typeof deserialized.lastSyncedAt === "string"
        ).toBe(true);
        expect(Array.isArray(deserialized.records)).toBe(true);
        expect(typeof deserialized.streakData).toBe("object");
        expect(deserialized.streakData).not.toBeNull();
        expect(typeof deserialized.goalSettings).toBe("object");
        expect(deserialized.goalSettings).not.toBeNull();

        // Verify streakData fields
        expect(typeof deserialized.streakData.current).toBe("number");
        expect(typeof deserialized.streakData.max).toBe("number");

        // Verify goalSettings fields
        expect(typeof deserialized.goalSettings.weeklyGoal).toBe("number");
        expect(
          deserialized.goalSettings.celebrationShownWeek === null ||
            typeof deserialized.goalSettings.celebrationShownWeek === "string"
        ).toBe(true);

        // Verify each record has valid date and positive count
        for (const record of deserialized.records) {
          expect(typeof record.date).toBe("string");
          // Validate ISO 8601 date format (YYYY-MM-DD)
          expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
          expect(typeof record.count).toBe("number");
          expect(Number.isInteger(record.count)).toBe(true);
          expect(record.count).toBeGreaterThanOrEqual(1);
        }
      }),
      { numRuns: 100 }
    );
  });
});
