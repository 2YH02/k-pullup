import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";

/**
 * Property 4: Max streak monotonicity invariant
 *
 * For any sequence of visit recording operations, the max streak value
 * should always be greater than or equal to the current streak, and
 * should never decrease over time.
 *
 * **Validates: Requirements 2.4**
 */

// Mock localStorage before importing the store
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

vi.stubGlobal("localStorage", localStorageMock);

// Import after mocking localStorage
import useChallengeStore from "@store/useChallengeStore";
import { getDefaultData } from "@lib/challenge-storage";

/** Generate a YYYY-MM-DD date string */
const dateArb = (): fc.Arbitrary<string> =>
  fc
    .record({
      year: fc.integer({ min: 2020, max: 2030 }),
      month: fc.integer({ min: 1, max: 12 }),
      day: fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
    })
    .map(
      ({ year, month, day }) =>
        `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    );

/** Generate a sequence of date strings representing successive recordVisit calls */
const visitSequenceArb = (): fc.Arbitrary<string[]> =>
  fc.array(dateArb(), { minLength: 1, maxLength: 20 });

describe("Feature: challenge-local-streak, Property 4: Max streak monotonicity invariant", () => {
  beforeEach(() => {
    localStorageMock.clear();
    useChallengeStore.setState({
      data: getDefaultData(),
      isHydrated: false,
      selectedCell: null,
    });
  });

  it("max streak is always >= current streak after each recordVisit", () => {
    fc.assert(
      fc.property(visitSequenceArb(), (dates) => {
        // Reset store to default state
        localStorageMock.clear();
        useChallengeStore.setState({
          data: getDefaultData(),
          isHydrated: false,
          selectedCell: null,
        });

        for (const date of dates) {
          useChallengeStore.getState().recordVisit(date);
          const { data } = useChallengeStore.getState();

          // max should always be >= current
          expect(data.streakData.max).toBeGreaterThanOrEqual(
            data.streakData.current
          );
        }
      }),
      { numRuns: 100 }
    );
  });

  it("max streak never decreases over time across recordVisit calls", () => {
    fc.assert(
      fc.property(visitSequenceArb(), (dates) => {
        // Reset store to default state
        localStorageMock.clear();
        useChallengeStore.setState({
          data: getDefaultData(),
          isHydrated: false,
          selectedCell: null,
        });

        let previousMax = 0;

        for (const date of dates) {
          useChallengeStore.getState().recordVisit(date);
          const { data } = useChallengeStore.getState();

          // max should never decrease
          expect(data.streakData.max).toBeGreaterThanOrEqual(previousMax);
          previousMax = data.streakData.max;
        }
      }),
      { numRuns: 100 }
    );
  });
});
