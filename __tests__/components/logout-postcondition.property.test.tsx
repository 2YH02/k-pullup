// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 12: Logout post-condition invariant
// **Validates: Requirements 5.4, 5.5**

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import type { User } from "@/types/user";
import { SESSION_CACHE_KEY } from "@lib/session-cache";

/**
 * Property 12: Logout post-condition invariant
 *
 * For any logout execution path (API success, API failure, or API timeout),
 * after the Signout_Handler completes, Auth_Store.user SHALL be null AND
 * sessionStorage SHALL not contain the user cache entry.
 *
 * **Validates: Requirements 5.4, 5.5**
 */

// Mock next/navigation
const mockReplace = vi.fn();
const mockRefresh = vi.fn();
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
    push: mockPush,
  }),
}));

// Mock signout API — configured per property run
const mockSignout = vi.fn();
vi.mock("@api/auth/signout", () => ({
  default: (...args: unknown[]) => mockSignout(...args),
}));

// Mock deleteUser (not used in signout flow but required by component)
vi.mock("@api/user/deleteUser", () => ({
  default: vi.fn(),
}));

// Mock useAlertStore
vi.mock("@store/useAlertStore", () => ({
  default: () => ({
    openAlert: vi.fn(),
  }),
}));

import useUserStore from "@store/useUserStore";
import UserSetting from "@pages/config/user-setting";

type LogoutOutcome = "success" | "error";
const logoutOutcomeArb = fc.constantFrom<LogoutOutcome>("success", "error");

const userArbitrary: fc.Arbitrary<User> = fc.record({
  userId: fc.integer({ min: 1 }),
  username: fc.string({ minLength: 1, maxLength: 30 }),
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
});

describe("Feature: auth-flow-improvements, Property 12: Logout post-condition invariant", () => {
  let locationHrefSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockSignout.mockReset();
    mockReplace.mockReset();
    sessionStorage.clear();
    // window.location.href mock
    locationHrefSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "http://localhost",
    } as Location);
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, href: "" },
    });
  });

  afterEach(() => {
    cleanup();
    locationHrefSpy?.mockRestore?.();
  });

  it(
    "after logout completes, store.user is null AND sessionStorage has no user cache, regardless of API outcome",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          userArbitrary,
          logoutOutcomeArb,
          async (user: User, outcome: LogoutOutcome) => {
            // Pre-populate store with a user (to prove it gets cleared)
            useUserStore.setState({ user, isLoading: false });

            // Pre-populate sessionStorage with user cache
            sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(user));

            // Configure signout mock based on outcome
            if (outcome === "success") {
              mockSignout.mockResolvedValue({ message: "ok" });
            } else {
              mockSignout.mockRejectedValue(new Error("API failure"));
            }

            render(<UserSetting />);

            // Find and click the logout button
            const logoutButton = screen.getByRole("button", { name: /로그아웃/ });
            fireEvent.click(logoutButton);

            // Wait for the handler to complete (window.location.href 설정 확인)
            await waitFor(() => {
              expect(window.location.href).toBe("/");
            });

            // Post-condition: store.user SHALL be null
            expect(useUserStore.getState().user).toBeNull();

            // Post-condition: sessionStorage SHALL not contain user cache
            expect(sessionStorage.getItem(SESSION_CACHE_KEY)).toBeNull();

            cleanup();
            window.location.href = "";
          }
        ),
        { numRuns: 100 }
      );
    },
    30000
  );
});
