import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import fetchData, { FetchError } from "@lib/fetchData";

/**
 * Property 4: Error response body preservation
 *
 * For any HTTP error response (status >= 400) with a readable body containing
 * arbitrary text content, the thrown FetchError's responseBody property SHALL
 * equal the response body text. If the body is unreadable or times out,
 * responseBody SHALL be null.
 *
 * **Validates: Requirements 2.10**
 */
describe("Feature: fetchdata-error-handling, Property 4: Error response body preservation", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("responseBody preserves the original body text for error responses", async () => {
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

          vi.mocked(fetch).mockResolvedValue(mockResponse);

          try {
            await fetchData(url);
            // Should not reach here
            expect.fail("fetchData should have thrown a FetchError");
          } catch (error) {
            expect(error).toBeInstanceOf(FetchError);
            const fetchError = error as FetchError;
            expect(fetchError.responseBody).toBe(bodyText);
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  it("responseBody is null when body read times out", async () => {
    vi.useFakeTimers();

    const url = "https://example.com/timeout-test";

    const mockResponse = {
      ok: false,
      status: 500,
      text: () => new Promise<string>(() => {}), // never resolves
    } as unknown as Response;

    vi.mocked(fetch).mockResolvedValue(mockResponse);

    const fetchPromise = fetchData(url).catch((error) => error);

    // Advance time past the 5000ms timeout
    await vi.advanceTimersByTimeAsync(5000);

    const error = await fetchPromise;

    expect(error).toBeInstanceOf(FetchError);
    expect((error as FetchError).responseBody).toBe(null);

    vi.useRealTimers();
  });
});
