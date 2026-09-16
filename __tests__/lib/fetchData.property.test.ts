import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import fetchData, { FetchError } from "@lib/fetchData";

/**
 * fetchData 프로퍼티 테스트 (통합)
 *
 * Property 1: FetchError 생성자 round-trip
 * Property 2: HTTP 에러 상태 → FetchError throw
 * Property 3: HTTP 성공 상태 → Response 반환
 * Property 4: 에러 응답 body 보존
 */

// ---------------------------------------------------------------------------
// Property 1: FetchError constructor round-trip
// ---------------------------------------------------------------------------
describe("Feature: fetchdata-error-handling, Property 1: FetchError constructor round-trip", () => {
  it("should preserve all constructor arguments as instance properties (without responseBody)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 599 }),
        fc.webUrl(),
        fc.string({ minLength: 1 }),
        (status, url, message) => {
          const error = new FetchError(status, url, message);

          expect(error.status).toBe(status);
          expect(error.url).toBe(url);
          expect(error.message).toBe(message);
          expect(error.name).toBe("FetchError");
          expect(error instanceof Error).toBe(true);
          expect(error instanceof FetchError).toBe(true);
          expect(error.responseBody).toBeNull();
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should preserve responseBody when provided", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 599 }),
        fc.webUrl(),
        fc.string({ minLength: 1 }),
        fc.string(),
        (status, url, message, responseBody) => {
          const error = new FetchError(status, url, message, responseBody);

          expect(error.status).toBe(status);
          expect(error.url).toBe(url);
          expect(error.message).toBe(message);
          expect(error.name).toBe("FetchError");
          expect(error instanceof Error).toBe(true);
          expect(error instanceof FetchError).toBe(true);
          expect(error.responseBody).toBe(responseBody);
        }
      ),
      { numRuns: 20 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: HTTP error status throws FetchError with correct properties
// ---------------------------------------------------------------------------
describe("Feature: fetchdata-error-handling, Property 2: HTTP error status throws FetchError with correct properties", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should throw FetchError with correct status, url, and message for any HTTP error status [400-599]", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 400, max: 599 }),
        fc.webUrl(),
        async (status, url) => {
          const mockResponse = {
            ok: false,
            status,
            text: () => Promise.resolve("error body"),
          } as unknown as Response;

          globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

          try {
            await fetchData(url);
            expect.fail("fetchData should have thrown a FetchError");
          } catch (error: unknown) {
            expect(error).toBeInstanceOf(FetchError);
            expect(error).toBeInstanceOf(Error);

            const fetchError = error as FetchError;

            expect(fetchError.status).toBe(status);
            expect(fetchError.url).toBe(url);
            expect(fetchError.message.length).toBeGreaterThan(0);
            expect(fetchError.message).toContain(String(status));
            expect(fetchError.name).toBe("FetchError");
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: HTTP success status returns Response
// ---------------------------------------------------------------------------
describe("Feature: fetchdata-error-handling, Property 3: HTTP success status returns Response", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("should return Response without throwing for any HTTP success status [200-299]", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 200, max: 299 }),
        fc.webUrl(),
        async (status, url) => {
          const mockResponse = new Response(null, { status });
          vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

          const result = await fetchData(url);

          expect(result).toBeInstanceOf(Response);
          expect(result.status).toBe(status);
        }
      ),
      { numRuns: 20 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: Error response body preservation
// ---------------------------------------------------------------------------
describe("Feature: fetchdata-error-handling, Property 4: Error response body preservation", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("should preserve response body text in FetchError.responseBody for any error response", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 400, max: 599 }),
        fc.webUrl(),
        fc.string(),
        async (status, url, bodyText) => {
          const mockResponse = {
            ok: false,
            status,
            text: () => Promise.resolve(bodyText),
          } as unknown as Response;

          vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

          try {
            await fetchData(url);
            expect.fail("fetchData should have thrown a FetchError");
          } catch (error: unknown) {
            expect(error).toBeInstanceOf(FetchError);

            const fetchError = error as FetchError;
            expect(fetchError.responseBody).toBe(bodyText);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it("should set responseBody to null when response.text() times out (exceeds 5 seconds)", async () => {
    vi.useFakeTimers();

    const url = "https://example.com/api/resource";
    const status = 500;

    const mockResponse = {
      ok: false,
      status,
      text: () => new Promise<string>(() => {}), // Never resolves
    } as unknown as Response;

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    const fetchPromise = fetchData(url).catch((error: unknown) => error);

    await vi.advanceTimersByTimeAsync(5001);

    const error = await fetchPromise;

    expect(error).toBeInstanceOf(FetchError);

    const fetchError = error as FetchError;
    expect(fetchError.responseBody).toBeNull();
    expect(fetchError.status).toBe(status);
    expect(fetchError.url).toBe(url);
  });
});
