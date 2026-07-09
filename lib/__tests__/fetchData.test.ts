import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { FetchError } from "@/lib/fetchData";

/**
 * Feature: fetchdata-error-handling, Property 1: FetchError constructor round-trip
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */
describe("Feature: fetchdata-error-handling, Property 1: FetchError constructor round-trip", () => {
  it("should preserve all constructor arguments as instance properties", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 599 }),
        fc.webUrl(),
        fc.string({ minLength: 1 }),
        (status, url, message) => {
          const error = new FetchError(status, url, message);

          expect(error.status).toBe(status);
          expect(error.url).toBe(url);
          expect(error.message).toBe(message);
          expect(error.name).toBe("FetchError");
          expect(error instanceof Error).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });
});
