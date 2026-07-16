import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";
import useChallengeStore from "@store/useChallengeStore";
import { getDefaultData } from "@lib/challenge-storage";

/**
 * Property 7: Goal setting persistence round-trip
 *
 * For any valid weekly goal value (integer in range 1-7), setting the goal
 * and then reading it back should return the same value.
 *
 * **Validates: Requirements 4.4**
 */

// Mock localStorage with a simple in-memory object
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
};

describe("Feature: challenge-local-streak, Property 7: Goal setting persistence round-trip", () => {
  beforeEach(() => {
    const mockStorage = createMockLocalStorage();
    Object.defineProperty(globalThis, "localStorage", {
      value: mockStorage,
      writable: true,
    });
    useChallengeStore.setState({
      data: getDefaultData(),
      isHydrated: false,
      selectedCell: null,
    });
  });

  it("setWeeklyGoal with valid values (1-7) persists the exact same value in store state", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 7 }),
        (goal) => {
          // Reset store to default before each iteration
          useChallengeStore.setState({ data: getDefaultData() });

          // Act: set the weekly goal
          useChallengeStore.getState().setWeeklyGoal(goal);

          // Assert: reading it back returns the same value
          const storedGoal =
            useChallengeStore.getState().data.goalSettings.weeklyGoal;
          expect(storedGoal).toBe(goal);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setWeeklyGoal clamps values below 1 to 1", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 0 }),
        (goal) => {
          useChallengeStore.setState({ data: getDefaultData() });

          useChallengeStore.getState().setWeeklyGoal(goal);

          const storedGoal =
            useChallengeStore.getState().data.goalSettings.weeklyGoal;
          expect(storedGoal).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("setWeeklyGoal clamps values above 7 to 7", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 8, max: 100 }),
        (goal) => {
          useChallengeStore.setState({ data: getDefaultData() });

          useChallengeStore.getState().setWeeklyGoal(goal);

          const storedGoal =
            useChallengeStore.getState().data.goalSettings.weeklyGoal;
          expect(storedGoal).toBe(7);
        }
      ),
      { numRuns: 100 }
    );
  });
});
