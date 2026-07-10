// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 1: UserProvider stores API response user
// **Validates: Requirements 1.1**

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, waitFor } from "@testing-library/react";
import type { User } from "@/types/user";

/**
 * Property 1: UserProvider stores API response user
 *
 * For any valid User object returned by the myInfo API, after UserProvider
 * completes initialization, Auth_Store.user SHALL deeply equal the returned
 * User object.
 *
 * **Validates: Requirements 1.1**
 */

// Mock session-cache to return null (clean state, no cache)
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => null,
  setSessionCache: vi.fn(),
  clearSessionCache: vi.fn(),
}));

// Mock myInfo — will be configured per property run
const mockMyInfo = vi.fn();
vi.mock("@api/user/myInfo", () => ({
  default: (...args: unknown[]) => mockMyInfo(...args),
}));

import useUserStore from "@store/useUserStore";
import UserProvider from "@provider/user-provider";

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

describe("Feature: auth-flow-improvements, Property 1: UserProvider stores API response user", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useUserStore.setState({ user: null, isLoading: true });
    mockMyInfo.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it(
    "after initialization, store.user deeply equals the User returned by myInfo",
    async () => {
      await fc.assert(
        fc.asyncProperty(userArbitrary, async (user: User) => {
          // Reset store state for each property run
          useUserStore.setState({ user: null, isLoading: true });
          mockMyInfo.mockResolvedValue(user);

          render(
            <UserProvider>
              <div>child</div>
            </UserProvider>
          );

          // Wait for the async bootstrap to complete
          await waitFor(() => {
            expect(useUserStore.getState().user).not.toBeNull();
          });

          const state = useUserStore.getState();
          expect(state.user).toEqual(user);

          cleanup();
        }),
        { numRuns: 100 }
      );
    },
    30000
  );
});
