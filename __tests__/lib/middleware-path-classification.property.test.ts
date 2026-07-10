// @vitest-environment happy-dom

// Feature: auth-flow-improvements, Property 5: Middleware path classification
// **Validates: Requirements 3.1, 3.3, 3.4, 3.5**

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";

/**
 * Property 5: Middleware path classification
 *
 * For any request path, the Route_Middleware SHALL classify it correctly:
 * - public paths (`/`, `/signin`, `/signup`, `/reset-password`, `/search`,
 *   `/article`, `/notice`, `/pullup`) and skip prefixes (`/_next/static/*`,
 *   `/_next/image/*`, `/favicon.ico`, `/api/v1/*`) always pass through
 *   regardless of cookie state;
 * - all other paths require cookie inspection.
 */

// --- Mock next/server ---

const mockNext = vi.fn(() => ({ type: "next" }));
const mockRedirect = vi.fn((url: URL) => ({ type: "redirect", url }));

vi.mock("next/server", () => ({
  NextRequest: class MockNextRequest {
    nextUrl: { pathname: string };
    url: string;
    cookies: { get: (name: string) => { value: string } | undefined };

    constructor(
      pathname: string,
      options?: { hasCookie?: boolean }
    ) {
      this.nextUrl = { pathname };
      this.url = `http://localhost:3000${pathname}`;
      const hasCookie = options?.hasCookie ?? false;
      this.cookies = {
        get: (name: string) =>
          hasCookie && name === "session"
            ? { value: "mock-session-token" }
            : undefined,
      };
    }
  },
  NextResponse: {
    next: () => mockNext(),
    redirect: (url: URL) => mockRedirect(url),
  },
}));

// Import middleware after mocking
import { middleware } from "../../middleware";

// --- Helper to create mock requests ---

interface MockRequest {
  nextUrl: { pathname: string };
  url: string;
  cookies: { get: (name: string) => { value: string } | undefined };
}

const createMockRequest = (
  pathname: string,
  hasCookie: boolean
): MockRequest => ({
  nextUrl: { pathname },
  url: `http://localhost:3000${pathname}`,
  cookies: {
    get: (name: string) =>
      hasCookie && name === "session"
        ? { value: "mock-session-token" }
        : undefined,
  },
});

// --- Path constants (matching middleware.ts) ---

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

// --- Arbitraries ---

/** Generates an exact public path or a sub-path of a public path */
const publicPathArbitrary = fc.oneof(
  // Exact public path
  fc.constantFrom(...PUBLIC_PATHS),
  // Sub-paths of non-root public paths (e.g., /article/123)
  fc.tuple(
    fc.constantFrom(...PUBLIC_PATHS.filter((p) => p !== "/")),
    fc.stringMatching(/^\/[a-z0-9\-]{1,20}$/)
  ).map(([base, suffix]) => `${base}${suffix}`)
);

/** Generates a path starting with a skip prefix */
const skipPrefixPathArbitrary = fc.oneof(
  // /_next/static/...
  fc.stringMatching(/^\/[a-z0-9\-_.]{1,30}$/).map(
    (suffix) => `/_next/static${suffix}`
  ),
  // /_next/image/...
  fc.stringMatching(/^\/[a-z0-9\-_.]{1,30}$/).map(
    (suffix) => `/_next/image${suffix}`
  ),
  // /favicon.ico (exact or with suffix)
  fc.constant("/favicon.ico"),
  fc.stringMatching(/^\/[a-z0-9]{1,10}$/).map(
    (suffix) => `/favicon.ico${suffix}`
  ),
  // /api/v1/...
  fc.stringMatching(/^\/[a-z0-9\-/]{1,30}$/).map(
    (suffix) => `/api/v1${suffix}`
  )
);

/** Generates a protected path (not public, not skip) */
const protectedPathArbitrary = fc
  .stringMatching(/^\/[a-z]{1,5}[a-z0-9\-]{0,15}$/)
  .filter((path) => {
    // Must not match any public path logic
    const isPublic = PUBLIC_PATHS.some((p) => {
      if (p === "/") return path === "/";
      return path === p || path.startsWith(`${p}/`);
    });
    // Must not match any skip prefix
    const isSkip = SKIP_PREFIXES.some((prefix) =>
      path.startsWith(prefix)
    );
    return !isPublic && !isSkip;
  });

// --- Tests ---

describe("Feature: auth-flow-improvements, Property 5: Middleware path classification", () => {
  beforeEach(() => {
    mockNext.mockClear();
    mockRedirect.mockClear();
  });

  it("public paths always pass through regardless of cookie state", () => {
    fc.assert(
      fc.property(
        publicPathArbitrary,
        fc.boolean(),
        (path: string, hasCookie: boolean) => {
          mockNext.mockClear();
          mockRedirect.mockClear();

          const request = createMockRequest(path, hasCookie);
          middleware(request as any);

          expect(mockNext).toHaveBeenCalled();
          expect(mockRedirect).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 200 }
    );
  });

  it("skip prefix paths always pass through regardless of cookie state", () => {
    fc.assert(
      fc.property(
        skipPrefixPathArbitrary,
        fc.boolean(),
        (path: string, hasCookie: boolean) => {
          mockNext.mockClear();
          mockRedirect.mockClear();

          const request = createMockRequest(path, hasCookie);
          middleware(request as any);

          expect(mockNext).toHaveBeenCalled();
          expect(mockRedirect).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 200 }
    );
  });

  it("protected paths without cookie trigger redirect", () => {
    fc.assert(
      fc.property(protectedPathArbitrary, (path: string) => {
        mockNext.mockClear();
        mockRedirect.mockClear();

        const request = createMockRequest(path, false);
        middleware(request as any);

        expect(mockRedirect).toHaveBeenCalled();
        expect(mockNext).not.toHaveBeenCalled();
      }),
      { numRuns: 200 }
    );
  });

  it("protected paths with cookie pass through", () => {
    fc.assert(
      fc.property(protectedPathArbitrary, (path: string) => {
        mockNext.mockClear();
        mockRedirect.mockClear();

        const request = createMockRequest(path, true);
        middleware(request as any);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
      }),
      { numRuns: 200 }
    );
  });
});
