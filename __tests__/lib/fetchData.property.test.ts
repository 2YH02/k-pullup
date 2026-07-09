import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { FetchError } from "@lib/fetchData";

/**
 * Property 1: FetchError constructor round-trip
 *
 * For any valid status (number 0–599), url (non-empty string), and message (non-empty string),
 * constructing a FetchError with these arguments SHALL produce an instance where:
 * - instance.status === status
 * - instance.url === url
 * - instance.message === message
 * - instance.name === "FetchError"
 * - instance instanceof Error === true
 * - instance.responseBody === null (when not provided)
 *
 * Also test with responseBody provided:
 * - instance.responseBody === responseBody
 *
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
 */
describe("Feature: fetchdata-error-handling, Property 1: FetchError constructor round-trip", () => {
  it("should preserve all constructor arguments as instance properties (without responseBody)", () => {
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
          expect(error instanceof FetchError).toBe(true);
          expect(error.responseBody).toBeNull();
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should preserve responseBody when provided", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 599 }),
        fc.webUrl(),
        fc.string({ minLength: 1 }),
        fc.string(),
        (status, url, message, responseBody) => {
          const error = new FetchError(status, url, message, responseBody);

          expect(error.status).toBe(status);
          expect(error.url).toBe(url);
          expect(error.message).toBe(message);
          expect(error.name).toBe("FetchError");
          expect(error instanceof Error).toBe(true);
          expect(error instanceof FetchError).toBe(true);
          expect(error.responseBody).toBe(responseBody);
        }
      ),
      { numRuns: 20 }
    );
  });
});
