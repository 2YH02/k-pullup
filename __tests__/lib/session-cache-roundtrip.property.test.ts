// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 8: User sessionStorage serialization round-trip
// **Validates: Requirements 4.1**

import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import {
  getSessionCache,
  setSessionCache,
  SESSION_CACHE_KEY,
} from "@lib/session-cache";
import type { User } from "@/types/user";

/**
 * Property 8: User sessionStorage serialization round-trip
 *
 * For any valid User object, storing it via `setSessionCache` and then
 * retrieving it via `getSessionCache` SHALL produce an object deeply equal
 * to the original User.
 */

const userArbitrary: fc.Arbitrary<User> = fc.record({
  userId: fc.integer({ min: 1 }),
  username: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  provider: fc.option(
    fc.constantFrom("google" as const, "naver" as const, "kakao" as const, "website" as const),
    { nil: undefined }
  ),
  chulbong: fc.option(fc.boolean(), { nil: undefined }),
  reportCount: fc.option(fc.nat(), { nil: undefined }),
  markerCount: fc.option(fc.nat(), { nil: undefined }),
  error: fc.option(fc.string(), { nil: undefined }),
});

describe("Feature: auth-flow-improvements, Property 8: User sessionStorage serialization round-trip", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("setSessionCache → getSessionCache produces a deeply equal User object", () => {
    fc.assert(
      fc.property(userArbitrary, (user: User) => {
        // Store the user
        setSessionCache(user);

        // Retrieve the user
        const retrieved = getSessionCache();

        // The retrieved user must deeply equal the original
        expect(retrieved).not.toBeNull();
        expect(retrieved).toEqual(user);
      }),
      { numRuns: 100 }
    );
  });
});
