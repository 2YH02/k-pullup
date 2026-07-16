import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

import { migrateData, CURRENT_VERSION } from "@lib/challenge-storage";
import type { ChallengeData, VisitRecord, StreakData, GoalSettings } from "@lib/challenge-storage";

/**
 * Property 9: Version migration correctness
 *
 * For any stored data with a version different from the current version,
 * loading the data should produce a valid ChallengeData object with version
 * equal to CURRENT_VERSION, preserving existing records where possible.
 *
 * **Validates: Requirements 7.2**
 */
describe("Feature: challenge-local-streak, Property 9: Version migration correctness", () => {
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
  const streakDataArb: fc.Arbitrary<StreakData> = fc.record({
    current: fc.integer({ min: 0, max: 365 }),
    max: fc.integer({ min: 0, max: 365 }),
  });

  // Arbitrary for ISO week identifier (e.g., "2024-W03")
  const weekIdentifierArb = fc
    .tuple(fc.integer({ min: 2020, max: 2030 }), fc.integer({ min: 1, max: 53 }))
    .map(([y, w]) => `${y}-W${String(w).padStart(2, "0")}`);

  // Arbitrary for GoalSettings
  const goalSettingsArb: fc.Arbitrary<GoalSettings> = fc.record({
    weeklyGoal: fc.integer({ min: 1, max: 7 }),
    celebrationShownWeek: fc.oneof(fc.constant(null), weekIdentifierArb),
  });

  // Arbitrary for data with a version != CURRENT_VERSION
  const nonCurrentVersionArb = fc.integer({ min: 0, max: 100 }).filter((v) => v !== CURRENT_VERSION);

  // Arbitrary for a stored object with different version but valid sub-fields
  const validDataWithDifferentVersionArb = fc.record({
    version: nonCurrentVersionArb,
    lastSyncedAt: fc.oneof(fc.constant(null), fc.date().map((d) => d.toISOString())),
    records: fc.array(visitRecordArb, { minLength: 0, maxLength: 20 }),
    streakData: streakDataArb,
    goalSettings: goalSettingsArb,
  });

  // Arbitrary for completely invalid data (non-object primitives)
  const invalidDataArb = fc.oneof(
    fc.constant(null),
    fc.constant(undefined),
    fc.integer(),
    fc.string(),
    fc.boolean(),
    fc.constant([]),
  );

  // Arbitrary for partially valid objects (some fields missing or wrong types)
  const partialObjectArb = fc.record(
    {
      version: fc.oneof(fc.integer(), fc.string(), fc.constant(undefined)),
      lastSyncedAt: fc.oneof(fc.constant(null), fc.string(), fc.integer()),
      records: fc.oneof(
        fc.array(visitRecordArb, { minLength: 0, maxLength: 10 }),
        fc.constant("not-an-array"),
        fc.constant(null)
      ),
      streakData: fc.oneof(streakDataArb, fc.constant(null), fc.constant("invalid")),
      goalSettings: fc.oneof(goalSettingsArb, fc.constant(null), fc.constant(42)),
    },
    { requiredKeys: [] }
  );

  // Helper: validate that a result is a valid ChallengeData
  const assertValidChallengeData = (result: ChallengeData) => {
    expect(result).toHaveProperty("version");
    expect(result).toHaveProperty("lastSyncedAt");
    expect(result).toHaveProperty("records");
    expect(result).toHaveProperty("streakData");
    expect(result).toHaveProperty("goalSettings");

    expect(result.version).toBe(CURRENT_VERSION);
    expect(typeof result.version).toBe("number");
    expect(result.lastSyncedAt === null || typeof result.lastSyncedAt === "string").toBe(true);
    expect(Array.isArray(result.records)).toBe(true);
    expect(typeof result.streakData).toBe("object");
    expect(result.streakData).not.toBeNull();
    expect(typeof result.streakData.current).toBe("number");
    expect(typeof result.streakData.max).toBe("number");
    expect(typeof result.goalSettings).toBe("object");
    expect(result.goalSettings).not.toBeNull();
    expect(typeof result.goalSettings.weeklyGoal).toBe("number");
    expect(
      result.goalSettings.celebrationShownWeek === null ||
        typeof result.goalSettings.celebrationShownWeek === "string"
    ).toBe(true);

    for (const record of result.records) {
      expect(typeof record.date).toBe("string");
      expect(typeof record.count).toBe("number");
    }
  };

  it("should produce valid ChallengeData with version=CURRENT_VERSION for data with different versions", () => {
    fc.assert(
      fc.property(validDataWithDifferentVersionArb, (data) => {
        const result = migrateData(data);

        assertValidChallengeData(result);
        expect(result.version).toBe(CURRENT_VERSION);
      }),
      { numRuns: 100 }
    );
  });

  it("should preserve valid sub-fields after migration", () => {
    fc.assert(
      fc.property(validDataWithDifferentVersionArb, (data) => {
        const result = migrateData(data);

        // Records should be preserved (all are valid VisitRecords)
        expect(result.records).toEqual(data.records);

        // StreakData should be preserved
        expect(result.streakData).toEqual(data.streakData);

        // GoalSettings should be preserved
        expect(result.goalSettings.weeklyGoal).toBe(data.goalSettings.weeklyGoal);
        expect(result.goalSettings.celebrationShownWeek).toBe(data.goalSettings.celebrationShownWeek);

        // lastSyncedAt should be preserved when it's a string
        if (typeof data.lastSyncedAt === "string") {
          expect(result.lastSyncedAt).toBe(data.lastSyncedAt);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("should return valid ChallengeData (default) for completely invalid data", () => {
    fc.assert(
      fc.property(invalidDataArb, (data) => {
        const result = migrateData(data);

        assertValidChallengeData(result);
        expect(result.version).toBe(CURRENT_VERSION);
      }),
      { numRuns: 100 }
    );
  });

  it("should return valid ChallengeData for partially valid objects", () => {
    fc.assert(
      fc.property(partialObjectArb, (data) => {
        const result = migrateData(data as unknown);

        assertValidChallengeData(result);
        expect(result.version).toBe(CURRENT_VERSION);
      }),
      { numRuns: 100 }
    );
  });
});
