import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";

/**
 * Property 8: Celebration once-per-week invariant
 *
 * For any sequence of goal achievements within the same ISO week,
 * the celebration should be marked as shown at most once, and
 * subsequent checks should indicate it has already been shown.
 *
 * **Validates: Requirements 5.4**
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

/** Generate the number of times markCelebrationShown is called (1-10) */
const callCountArb = (): fc.Arbitrary<number> =>
  fc.integer({ min: 1, max: 10 });

/** Week identifier pattern: "YYYY-WNN" */
const WEEK_ID_PATTERN = /^\d{4}-W\d{2}$/;

describe("Feature: challenge-local-streak, Property 8: Celebration once-per-week invariant", () => {
  beforeEach(() => {
    localStorageMock.clear();
    useChallengeStore.setState({
      data: getDefaultData(),
      isHydrated: false,
      selectedCell: null,
    });
  });

  it("markCelebrationShown sets celebrationShownWeek on first call and subsequent calls do not change it", () => {
    fc.assert(
      fc.property(callCountArb(), (n) => {
        // Reset store to default state
        localStorageMock.clear();
        useChallengeStore.setState({
          data: getDefaultData(),
          isHydrated: false,
          selectedCell: null,
        });

        // Initially celebrationShownWeek should be null
        expect(
          useChallengeStore.getState().data.goalSettings.celebrationShownWeek
        ).toBeNull();

        // First call: sets the week identifier
        useChallengeStore.getState().markCelebrationShown();
        const afterFirst =
          useChallengeStore.getState().data.goalSettings.celebrationShownWeek;

        // After first call, it should be a valid week identifier
        expect(afterFirst).not.toBeNull();
        expect(afterFirst).toMatch(WEEK_ID_PATTERN);

        // Subsequent calls (N-1 more times): value should remain the same
        for (let i = 1; i < n; i++) {
          useChallengeStore.getState().markCelebrationShown();
          const current =
            useChallengeStore.getState().data.goalSettings.celebrationShownWeek;

          // Value should not change after subsequent calls in the same week
          expect(current).toBe(afterFirst);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("celebrationShownWeek is always a valid YYYY-WNN format after markCelebrationShown", () => {
    fc.assert(
      fc.property(callCountArb(), (n) => {
        // Reset store to default state
        localStorageMock.clear();
        useChallengeStore.setState({
          data: getDefaultData(),
          isHydrated: false,
          selectedCell: null,
        });

        for (let i = 0; i < n; i++) {
          useChallengeStore.getState().markCelebrationShown();
          const weekId =
            useChallengeStore.getState().data.goalSettings.celebrationShownWeek;

          // Should always be a valid week identifier
          expect(weekId).not.toBeNull();
          expect(weekId).toMatch(WEEK_ID_PATTERN);

          // Week number should be in valid range (01-53)
          const weekNum = parseInt(weekId!.split("-W")[1], 10);
          expect(weekNum).toBeGreaterThanOrEqual(1);
          expect(weekNum).toBeLessThanOrEqual(53);
        }
      }),
      { numRuns: 100 }
    );
  });
});
