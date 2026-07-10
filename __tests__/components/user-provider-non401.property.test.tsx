// @vitest-environment happy-dom
// Feature: auth-flow-improvements, Property 2: Non-401 errors produce warning without store mutation
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, waitFor } from "@testing-library/react";
import { FetchError } from "@lib/fetchData";

/**
 * Property 2: Non-401 errors produce warning without store mutation
 *
 * For any FetchError with a status code other than 401, when thrown during
 * UserProvider initialization, console.warn SHALL be called with the error
 * and Auth_Store.user SHALL remain null.
 *
 * **Validates: Requirements 1.3**
 */

// Mock @api/user/myInfo
let mockMyInfoImpl: () => Promise<unknown> = () => Promise.resolve({});
vi.mock("@api/user/myInfo", () => ({
  default: () => mockMyInfoImpl(),
}));

// Mock @lib/session-cache — getSessionCache returns null for clean state (no cache)
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => null,
  setSessionCache: vi.fn(),
  clearSessionCache: vi.fn(),
}));

import UserProvider from "@provider/user-provider";
import useUserStore from "@store/useUserStore";

beforeEach(() => {
  // Reset store to initial state before each test
  useUserStore.setState({ user: null, isLoading: true });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Arbitrary: generate non-401 HTTP status codes
// Includes: 0 (network error), 400, 402-599
const non401StatusArb = fc.oneof(
  fc.constant(0), // network error
  fc.constant(400), // bad request
  fc.integer({ min: 402, max: 599 }) // all 4xx (except 401) and 5xx
);

describe("Feature: auth-flow-improvements, Property 2: Non-401 errors produce warning without store mutation", () => {
  it("non-401 FetchError triggers console.warn and user remains null", { timeout: 30000 }, async () => {
    await fc.assert(
      fc.asyncProperty(non401StatusArb, async (status) => {
        // Reset store state
        useUserStore.setState({ user: null, isLoading: true });

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

        // Assert: console.warn was called with the error
        expect(warnSpy).toHaveBeenCalledWith(error);

        // Assert: store.user remains null
        expect(useUserStore.getState().user).toBeNull();

        // Cleanup for next iteration
        warnSpy.mockRestore();
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
