// Feature: auth-flow-improvements, Property 6: Unauthenticated protected access redirect format
// **Validates: Requirements 3.2**

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

/**
 * Property 6: Unauthenticated protected access redirect format
 *
 * For any non-public, non-skip request path accessed without a session cookie,
 * the Route_Middleware SHALL respond with a redirect to `/signin?returnUrl=<original_path>`
 * where the returnUrl matches the original request path.
 */

const PUBLIC_PATHS = [
  "/",
  "/signin",
  "/signup",
  "/reset-password",
  "/search",
  "/article",
  "/notice",
  "/pullup",
  "/social",
  "/challenge",
  "/moments",
  "/terms",
  "/user-info",
];

const SKIP_PREFIXES = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/api/v1",
];

// Generate non-public, non-skip paths
const nonPublicPathArbitrary = fc
  .array(
    fc.stringMatching(/^[a-z0-9][a-z0-9-]*$/).filter((s) => s.length >= 1 && s.length <= 20),
    { minLength: 1, maxLength: 3 }
  )
  .map((segments) => `/${segments.join("/")}`)
  .filter((path) => {
    // Exclude public paths and their sub-paths
    const isPublic = PUBLIC_PATHS.some((publicPath) => {
      if (publicPath === "/") return path === "/";
      return path === publicPath || path.startsWith(`${publicPath}/`);
    });
    if (isPublic) return false;

    // Exclude skip prefixes
    const isSkip = SKIP_PREFIXES.some((prefix) => path.startsWith(prefix));
    if (isSkip) return false;

    return true;
  });

// Mock NextResponse
const mockRedirect = vi.fn();
const mockNext = vi.fn();

vi.mock("next/server", () => ({
  NextRequest: class MockNextRequest {
    nextUrl: URL;
    url: string;
    cookies: { get: (name: string) => undefined | { name: string; value: string } };

    constructor(url: string, options?: { cookies?: Record<string, string> }) {
      this.url = url;
      this.nextUrl = new URL(url);
      const cookieStore = options?.cookies || {};
      this.cookies = {
        get: (name: string) => {
          if (cookieStore[name]) {
            return { name, value: cookieStore[name] };
          }
          return undefined;
        },
      };
    }
  },
  NextResponse: {
    redirect: (url: URL) => {
      mockRedirect(url);
      return { type: "redirect", url: url.toString() };
    },
    next: () => {
      mockNext();
      return { type: "next" };
    },
  },
}));

describe("Feature: auth-flow-improvements, Property 6: Unauthenticated protected access redirect format", () => {
  let middleware: (request: any) => any;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Dynamic import to apply mocks
    const mod = await import("@/middleware");
    middleware = mod.middleware;
  });

  it("redirects unauthenticated protected paths to /signin?returnUrl=<original_path>", () => {
    fc.assert(
      fc.property(nonPublicPathArbitrary, (path: string) => {
        vi.clearAllMocks();

        // Create a request without session cookie
        const { NextRequest } = require("next/server");
        const request = new NextRequest(`http://localhost:3000${path}`);

        const response = middleware(request);

        // Should be a redirect (not next)
        expect(response.type).toBe("redirect");
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRedirect).toHaveBeenCalledTimes(1);

        // Parse the redirect URL
        const redirectUrl = new URL(mockRedirect.mock.calls[0][0]);

        // The redirect path should be /signin
        expect(redirectUrl.pathname).toBe("/signin");

        // The returnUrl param should equal the original path
        expect(redirectUrl.searchParams.get("returnUrl")).toBe(path);
      }),
      { numRuns: 100 }
    );
  });
});
