// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 4: Signin response stored directly without myInfo call
// **Validates: Requirements 2.1**

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import type { User } from "@/types/user";

/**
 * Property 4: Signin response stored directly without myInfo call
 *
 * For any valid signin API response containing a User object with a userId field,
 * the Signin_Handler SHALL set Auth_Store.user to that exact User object without
 * invoking the myInfo API.
 *
 * **Validates: Requirements 2.1**
 */

// Mock signin API — will be configured per property run
const mockSignin = vi.fn();
vi.mock("@api/auth/signin", () => ({
  default: (...args: unknown[]) => mockSignin(...args),
}));

// Mock myInfo — should NEVER be called
const mockMyInfo = vi.fn();
vi.mock("@api/user/myInfo", () => ({
  default: (...args: unknown[]) => mockMyInfo(...args),
}));

// Mock session-cache
const mockSetSessionCache = vi.fn();
vi.mock("@lib/session-cache", () => ({
  getSessionCache: () => null,
  setSessionCache: (...args: unknown[]) => mockSetSessionCache(...args),
  clearSessionCache: vi.fn(),
}));

// Mock next/navigation
const mockReplace = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
    refresh: mockRefresh,
    push: vi.fn(),
  }),
}));

// Mock useToast
vi.mock("@hooks/useToast", () => ({
  useToast: () => ({ toast: vi.fn(), toasts: [], dismiss: vi.fn() }),
}));

// Mock useBottomSheetStore
vi.mock("@store/useBottomSheetStore", () => ({
  useBottomSheetStore: () => ({ show: vi.fn(), hide: vi.fn(), isView: false, id: null }),
}));

// Mock useTermsStore
vi.mock("@store/useTermsStore", () => ({
  default: () => ({ setIsTermsAgreed: vi.fn(), isTermsAgreed: false }),
}));

// Mock validate — return no errors so the form can be submitted
vi.mock("@lib/validate", () => ({
  validateSigin: () => ({}),
  validateEmail: () => true,
  validatePassword: () => true,
  validateMassage: { email: "", password: "", emailCode: "" },
}));

// Mock fetchData's FetchError
vi.mock("@lib/fetchData", () => ({
  FetchError: class FetchError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import useUserStore from "@store/useUserStore";
import SigninForm from "@pages/signin/signin-form";

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
  error: fc.option(fc.constant(undefined), { nil: undefined }),
});

describe("Feature: auth-flow-improvements, Property 4: Signin response stored directly without myInfo call", () => {
  beforeEach(() => {
    useUserStore.setState({ user: null, isLoading: false });
    mockSignin.mockReset();
    mockMyInfo.mockReset();
    mockSetSessionCache.mockReset();
    mockReplace.mockReset();
    mockRefresh.mockReset();
  });

  afterEach(() => {
    cleanup();
  });

  it(
    "signin response user is stored directly in Auth_Store without calling myInfo",
    async () => {
      await fc.assert(
        fc.asyncProperty(userArbitrary, async (user: User) => {
          // Reset state for each property run
          useUserStore.setState({ user: null, isLoading: false });
          mockSignin.mockReset();
          mockMyInfo.mockReset();
          mockSetSessionCache.mockReset();

          // Configure signin mock to return success with the random user
          mockSignin.mockResolvedValue({
            token: "test-token",
            user,
          });

          const { container } = render(<SigninForm />);

          // Fill in email and password fields
          const emailInput = container.querySelector('input[name="email"]');
          const passwordInput = container.querySelector('input[name="password"]');

          if (!emailInput || !passwordInput) {
            throw new Error("Input fields not found");
          }

          fireEvent.change(emailInput, { target: { value: "test@example.com", name: "email" } });
          fireEvent.change(passwordInput, { target: { value: "Password1", name: "password" } });

          // Find and click the submit button
          const submitButton = container.querySelector("button");
          if (!submitButton) {
            throw new Error("Submit button not found");
          }

          fireEvent.click(submitButton);

          // Wait for the async submit handler to complete
          await waitFor(() => {
            expect(useUserStore.getState().user).not.toBeNull();
          });

          // Assert: store.user equals the mocked user
          const storeUser = useUserStore.getState().user;
          expect(storeUser).toEqual(user);

          // Assert: myInfo was never called
          expect(mockMyInfo).not.toHaveBeenCalled();

          // Assert: setSessionCache was called with the user
          expect(mockSetSessionCache).toHaveBeenCalledWith(user);

          cleanup();
        }),
        { numRuns: 100 }
      );
    },
    60000
  );
});
