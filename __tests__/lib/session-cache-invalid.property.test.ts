/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { getSessionCache, SESSION_CACHE_KEY } from "@lib/session-cache";

/**
 * Property 11: Invalid cache detection and cleanup
 *
 * For any sessionStorage value that is either unparseable as JSON or parses
 * to an object without a `userId` field, the UserProvider SHALL remove the
 * cache entry and initiate a fresh server API call.
 *
 * Here we test the session-cache module behavior:
 * getSessionCache returns null AND removes the invalid cache entry.
 *
 * **Validates: Requirements 4.5**
 */
describe("Feature: auth-flow-improvements, Property 11: Invalid cache detection and cleanup", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("should return null and remove cache for invalid JSON strings", () => {
    const invalidJsonArb = fc
      .string({ minLength: 1 })
      .filter((s) => {
        try {
          JSON.parse(s);
          return false;
        } catch {
          return true;
        }
      });

    fc.assert(
      fc.property(invalidJsonArb, (invalidJson) => {
        // Arrange: set invalid JSON in sessionStorage
        sessionStorage.setItem(SESSION_CACHE_KEY, invalidJson);

        // Act
        const result = getSessionCache();

        // Assert: returns null
        expect(result).toBeNull();

        // Assert: cache entry removed
        expect(sessionStorage.getItem(SESSION_CACHE_KEY)).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it("should return null and remove cache for valid JSON objects without userId field", () => {
    const objectWithoutUserIdArb = fc
      .dictionary(
        fc.string().filter((k) => k !== "userId"),
        fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null))
      )
      .map((obj) => JSON.stringify(obj));

    fc.assert(
      fc.property(objectWithoutUserIdArb, (jsonStr) => {
        // Arrange: set valid JSON without userId in sessionStorage
        sessionStorage.setItem(SESSION_CACHE_KEY, jsonStr);

        // Act
        const result = getSessionCache();

        // Assert: returns null
        expect(result).toBeNull();

        // Assert: cache entry removed
        expect(sessionStorage.getItem(SESSION_CACHE_KEY)).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it("should return null and remove cache for objects with non-number userId", () => {
    const nonNumberUserIdArb = fc
      .oneof(
        fc.string(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.array(fc.integer())
      )
      .map((userId) => JSON.stringify({ userId, username: "test" }));

    fc.assert(
      fc.property(nonNumberUserIdArb, (jsonStr) => {
        // Arrange: set JSON with non-number userId in sessionStorage
        sessionStorage.setItem(SESSION_CACHE_KEY, jsonStr);

        // Act
        const result = getSessionCache();

        // Assert: returns null
        expect(result).toBeNull();

        // Assert: cache entry removed
        expect(sessionStorage.getItem(SESSION_CACHE_KEY)).toBeNull();
      }),
      { numRuns: 100 }
    );
  });
});
