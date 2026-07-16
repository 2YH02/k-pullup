import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { getIntensityLevel } from "@lib/challenge-streak";

/**
 * Property 5: Heatmap intensity mapping determinism
 *
 * For any non-negative integer visit count, the intensity mapping function
 * should return exactly one of four levels:
 * - 0 for count=0
 * - 1 for count=1
 * - 2 for count in [2,3]
 * - 3 for count >= 4
 *
 * **Validates: Requirements 3.2**
 */
describe("Feature: challenge-local-streak, Property 5: Heatmap intensity mapping determinism", () => {
  it("returns correct intensity level for any non-negative integer", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        (count) => {
          const level = getIntensityLevel(count);

          if (count === 0) expect(level).toBe(0);
          else if (count === 1) expect(level).toBe(1);
          else if (count <= 3) expect(level).toBe(2);
          else expect(level).toBe(3);

          // Also verify it returns exactly one of the valid levels
          expect([0, 1, 2, 3]).toContain(level);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("is deterministic - same input always produces same output", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10000 }),
        (count) => {
          const result1 = getIntensityLevel(count);
          const result2 = getIntensityLevel(count);
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
