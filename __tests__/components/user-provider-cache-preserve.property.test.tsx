// @vitest-environment happy-dom
// Feature: auth-flow-improvements, Property 10: Non-401 background errors preserve cache
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, waitFor } from "@testing-library/react";
import { FetchError } from "@lib/fetchData";

/**
 * Property 10: Non-401 background errors preserve cache
 *
 * For any non-401 error (network failure, 5xx, etc.) occurring during background
 * server validation, the cached User in sessionStorage SHALL remain unchanged and
 * Auth_Store.user SHALL remain as the cached value.
 *
 * **Validates: Requirements 4.4**
 */

// Mock @api/user/myInfo
let mockMyInfoImpl: () => Promise<unknown> = () => Promise.resolve({});
vi.mock("@api/user/myInfo", () => ({
  default: () => mockMyInfoImpl(),
}));

// Mock @lib/session-cache — getSessionCache controlled per iteration
let mockGetSessionCacheResult: unknown = null;
const mockSetSessionCache = vi.fn();
const mockClearSessionCache = vi.fn();
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => mockGetSessionCacheResult,
  setSessionCache: (...args: unknown[]) => mockSetSessionCache(...args),
  clearSessionCache: (...args: unknown[]) => mockClearSessionCache(...args),
}));

import UserProvider from "@provider/user-provider";
import useUserStore from "@store/useUserStore";

beforeEach(() => {
  useUserStore.setState({ user: null, isLoading: true });
  mockSetSessionCache.mockClear();
  mockClearSessionCache.mockClear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Arbitrary: generate valid User objects
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

// Arbitrary: generate non-401 HTTP status codes
const non401StatusArb = fc.oneof(
  fc.constant(0), // network error
  fc.constant(400), // bad request
  fc.integer({ min: 402, max: 599 }) // all 4xx (except 401) and 5xx
);

describe("Feature: auth-flow-improvements, Property 10: Non-401 background errors preserve cache", () => {
  it("non-401 background error preserves cached user in store and does not clear cache", async () => {
    await fc.assert(
      fc.asyncProperty(userArbitrary, non401StatusArb, async (cachedUser, status) => {
        // Reset store state
        useUserStore.setState({ user: null, isLoading: true });
        mockSetSessionCache.mockClear();
        mockClearSessionCache.mockClear();

        // Setup: getSessionCache returns the generated User (simulating cached state)
        mockGetSessionCacheResult = cachedUser;

        // Setup: myInfo throws FetchError with the generated non-401 status
        const error = new FetchError(
          status,
          "/api/v1/users/me",
          `Error ${status}`,
          null
        );
        mockMyInfoImpl = () => Promise.reject(error);

        // Spy on console.warn
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

        // Render UserProvider
        render(
          <UserProvider>
            <div>child</div>
          </UserProvider>
        );

        // Wait for the async bootstrap effect to complete
        await waitFor(() => {
          expect(useUserStore.getState().isLoading).toBe(false);
        });

        // Assert: Auth_Store.user deeply equals the cached User (not null, not changed)
        expect(useUserStore.getState().user).toEqual(cachedUser);

        // Assert: clearSessionCache was NOT called (cache preserved)
        expect(mockClearSessionCache).not.toHaveBeenCalled();

        // Assert: console.warn was called with the error
        expect(warnSpy).toHaveBeenCalledWith(error);

        // Cleanup for next iteration
        warnSpy.mockRestore();
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
