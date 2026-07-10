// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 3: isLoading lifecycle invariant
// **Validates: Requirements 1.4, 1.5**

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fc from "fast-check";
import { render, waitFor } from "@testing-library/react";
import useUserStore from "@store/useUserStore";
import type { User } from "@/types/user";
import { FetchError } from "@lib/fetchData";

// Mock @lib/session-cache — always return null (no cache case)
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => null,
  setSessionCache: vi.fn(),
  clearSessionCache: vi.fn(),
  SESSION_CACHE_KEY: "k-pullup-user-cache",
}));

// Mock @api/user/myInfo — will be configured per test run
const mockMyInfo = vi.fn();
vi.mock("@api/user/myInfo", () => ({
  default: () => mockMyInfo(),
}));

/**
 * Property 3: isLoading lifecycle invariant
 *
 * For any API outcome (success with valid user, 401 error, network error,
 * or other server error), Auth_Store.isLoading SHALL be true before the async
 * operation resolves and SHALL be false after the operation completes.
 */

// Arbitrary for User objects
const userArbitrary: fc.Arbitrary<User> = fc.record({
  userId: fc.integer({ min: 1 }),
  username: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  provider: fc.option(
    fc.constantFrom(
      "google" as const,
      "naver" as const,
      "kakao" as const,
      "website" as const
    ),
    { nil: undefined }
  ),
  chulbong: fc.option(fc.boolean(), { nil: undefined }),
  reportCount: fc.option(fc.nat(), { nil: undefined }),
  markerCount: fc.option(fc.nat(), { nil: undefined }),
  error: fc.option(fc.string(), { nil: undefined }),
});

// Arbitrary for API outcomes
type ApiOutcome =
  | { type: "success"; user: User }
  | { type: "error-401" }
  | { type: "error-other"; status: number }
  | { type: "network-error" };

const apiOutcomeArbitrary: fc.Arbitrary<ApiOutcome> = fc.oneof(
  userArbitrary.map((user) => ({ type: "success" as const, user })),
  fc.constant({ type: "error-401" as const }),
  fc.integer({ min: 402, max: 599 }).map((status) => ({
    type: "error-other" as const,
    status,
  })),
  fc.constant({ type: "network-error" as const })
);

// Configure mockMyInfo based on outcome
const configureMock = (outcome: ApiOutcome): void => {
  switch (outcome.type) {
    case "success":
      mockMyInfo.mockResolvedValue(outcome.user);
      break;
    case "error-401":
      mockMyInfo.mockRejectedValue(
        new FetchError(401, "/api/v1/users/me", "인증 실패")
      );
      break;
    case "error-other":
      mockMyInfo.mockRejectedValue(
        new FetchError(
          outcome.status,
          "/api/v1/users/me",
          `서버 오류 ${outcome.status}`
        )
      );
      break;
    case "network-error":
      mockMyInfo.mockRejectedValue(
        new FetchError(0, "/api/v1/users/me", "네트워크 오류")
      );
      break;
  }
};

// Dynamically import UserProvider to ensure fresh module per test
const loadUserProvider = async () => {
  const mod = await import(
    "@provider/user-provider"
  );
  return mod.default;
};

describe("Feature: auth-flow-improvements, Property 3: isLoading lifecycle invariant", () => {
  beforeEach(() => {
    // Reset store to initial state (isLoading: true, user: null)
    useUserStore.setState({ user: null, isLoading: true });
    mockMyInfo.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it(
    "isLoading is true initially and becomes false after API completes for any outcome",
    async () => {
      const UserProvider = await loadUserProvider();

      await fc.assert(
        fc.asyncProperty(apiOutcomeArbitrary, async (outcome: ApiOutcome) => {
          // Reset store before each property run
          useUserStore.setState({ user: null, isLoading: true });
          mockMyInfo.mockReset();

          // Configure mock for this outcome
          configureMock(outcome);

          // Assert: isLoading is true before render (from store definition)
          expect(useUserStore.getState().isLoading).toBe(true);

          // Render UserProvider
          const { unmount } = render(
            <UserProvider>
              <div>test child</div>
            </UserProvider>
          );

          // Wait for the async bootstrap to complete
          await waitFor(() => {
            expect(useUserStore.getState().isLoading).toBe(false);
          });

          // Assert: isLoading is false after completion
          expect(useUserStore.getState().isLoading).toBe(false);

          // Cleanup
          unmount();
        }),
        { numRuns: 100 }
      );
    },
    30000
  );
});
