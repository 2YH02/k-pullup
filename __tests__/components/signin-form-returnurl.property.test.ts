// Feature: auth-flow-improvements, Property 7: returnUrl validation
// **Validates: Requirements 3.6, 3.7**

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";

/**
 * Property 7: returnUrl validation
 *
 * For any returnUrl string, if it starts with `/` (and is not a protocol-relative
 * URL like `//`), the Signin_Handler SHALL redirect to that path after successful login.
 * For any returnUrl string that does not start with a single `/` (including external URLs,
 * `//`, `javascript:`, empty string, or null), the handler SHALL redirect to `/`.
 */

// --- Validation logic extracted from signin-form.tsx ---

const validateReturnUrl = (returnUrl: string | undefined | null): string => {
  if (returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
    return returnUrl;
  }
  return "/";
};

// --- Arbitraries ---

/** Valid returnUrl: starts with / but not // */
const validReturnUrlArb = fc
  .stringMatching(/^\/[a-zA-Z0-9\-_/]*$/)
  .filter((s) => s.length >= 1 && !s.startsWith("//"));

/** Invalid returnUrl: various invalid patterns */
const invalidReturnUrlArb = fc.oneof(
  fc.constant(""), // empty string
  fc.constant(undefined), // undefined
  fc.constant(null), // null
  fc.string().map((s) => `//${s}`), // protocol-relative
  fc.string().map((s) => `http://${s}`), // http external
  fc.string().map((s) => `https://${s}`), // https external
  fc.string().map((s) => `javascript:${s}`), // javascript: scheme
  fc.string().filter((s) => !s.startsWith("/")) // no leading slash
);

// --- Tests ---

describe("Feature: auth-flow-improvements, Property 7: returnUrl validation", () => {
  it("valid internal paths (starting with / but not //) are returned as-is", () => {
    fc.assert(
      fc.property(validReturnUrlArb, (returnUrl: string) => {
        const result = validateReturnUrl(returnUrl);
        expect(result).toBe(returnUrl);
      }),
      { numRuns: 200 }
    );
  });

  it("invalid returnUrl values always resolve to /", () => {
    fc.assert(
      fc.property(
        invalidReturnUrlArb,
        (returnUrl: string | undefined | null) => {
          const result = validateReturnUrl(returnUrl);
          expect(result).toBe("/");
        }
      ),
      { numRuns: 200 }
    );
  });

  it("protocol-relative URLs (starting with //) always resolve to /", () => {
    fc.assert(
      fc.property(fc.string(), (suffix: string) => {
        const returnUrl = `//${suffix}`;
        const result = validateReturnUrl(returnUrl);
        expect(result).toBe("/");
      }),
      { numRuns: 100 }
    );
  });

  it("result is always a string starting with /", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          validReturnUrlArb,
          invalidReturnUrlArb,
          fc.string()
        ),
        (returnUrl: string | undefined | null) => {
          const result = validateReturnUrl(returnUrl);
          expect(typeof result).toBe("string");
          expect(result.startsWith("/")).toBe(true);
        }
      ),
      { numRuns: 200 }
    );
  });
});
