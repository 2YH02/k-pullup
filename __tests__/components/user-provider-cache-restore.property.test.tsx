// @vitest-environment happy-dom
// Feature: auth-flow-improvements, Property 9: Cache restoration on mount
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup } from "@testing-library/react";

/**
 * Property 9: Cache restoration on mount
 *
 * For any valid User object previously stored in sessionStorage (with valid JSON
 * and userId field present), when UserProvider mounts, it SHALL synchronously
 * restore Auth_Store.user to equal the cached User before the background API
 * call resolves.
 *
 * **Validates: Requirements 4.2**
 */

// Mock @api/user/myInfo — never resolves during test to ensure we test synchronous restore
vi.mock("@api/user/myInfo", () => ({
  default: () => new Promise(() => {}), // never resolves
}));

// Mock @lib/session-cache — getSessionCache will be controlled per test iteration
let mockGetSessionCacheResult: unknown = null;
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => mockGetSessionCacheResult,
  setSessionCache: vi.fn(),
  clearSessionCache: vi.fn(),
}));

import UserProvider from "@provider/user-provider";
import useUserStore from "@store/useUserStore";

beforeEach(() => {
  useUserStore.setState({ user: null, isLoading: true });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Arbitrary: generate valid User objects with userId field present
const userArbitrary = fc.record({
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

describe("Feature: auth-flow-improvements, Property 9: Cache restoration on mount", () => {
  it("cached User is synchronously restored to Auth_Store before API resolves", async () => {
    await fc.assert(
      fc.asyncProperty(userArbitrary, async (cachedUser) => {
        // Reset store state
        useUserStore.setState({ user: null, isLoading: true });

        // Setup: getSessionCache returns the generated User (simulating cached state)
        mockGetSessionCacheResult = cachedUser;

        // Render UserProvider (myInfo never resolves)
        render(
          <UserProvider>
            <div>child</div>
          </UserProvider>
        );

        // IMMEDIATELY after render, before API resolves:
        // The store should have the cached user (synchronous restore)
        const state = useUserStore.getState();
        expect(state.user).toEqual(cachedUser);

        // isLoading should be false since cache was found and applied
        expect(state.isLoading).toBe(false);

        // Cleanup for next iteration
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
