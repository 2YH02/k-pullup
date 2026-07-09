import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import fetchData, { FetchError } from "@lib/fetchData";

/**
 * Property 4: Error response body preservation
 *
 * For any HTTP error response (status >= 400) with a readable body containing
 * arbitrary text content, the thrown FetchError's `responseBody` property SHALL
 * equal the response body text. If the body is unreadable or times out,
 * `responseBody` SHALL be null.
 *
 * **Validates: Requirements 2.10**
 */
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
          // Mock fetch to return an error response with the generated body
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

    // Mock fetch to return a response where text() never resolves
    const mockResponse = {
      ok: false,
      status,
      text: () => new Promise<string>(() => {}), // Never resolves
    } as unknown as Response;

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

    const fetchPromise = fetchData(url).catch((error: unknown) => error);

    // Advance time past the 5-second timeout
    await vi.advanceTimersByTimeAsync(5001);

    const error = await fetchPromise;

    expect(error).toBeInstanceOf(FetchError);

    const fetchError = error as FetchError;
    expect(fetchError.responseBody).toBeNull();
    expect(fetchError.status).toBe(status);
    expect(fetchError.url).toBe(url);
  });
});
