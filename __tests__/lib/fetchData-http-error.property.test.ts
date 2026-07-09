import { describe, it, expect, vi, afterEach } from "vitest";
import * as fc from "fast-check";
import fetchData, { FetchError } from "@lib/fetchData";

/**
 * Property 2: HTTP error status throws FetchError with correct properties
 *
 * For any HTTP response with status code in the range [400, 599],
 * calling fetchData SHALL throw a FetchError where:
 * - error.status equals the response status code
 * - error.url equals the URL argument passed to fetchData
 * - error.message is a non-empty string containing the numeric status code
 *
 * **Validates: Requirements 1.4, 2.1, 2.3, 2.4, 2.5, 2.6, 2.7**
 */
describe("Feature: fetchdata-error-handling, Property 2: HTTP error status throws FetchError with correct properties", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should throw FetchError with correct status, url, and message for any HTTP error status [400-599]", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 400, max: 599 }),
        fc.webUrl(),
        async (status, url) => {
          // Mock fetch to return a Response-like object with the generated error status
          const mockResponse = {
            ok: false,
            status,
            text: () => Promise.resolve(""),
          } as unknown as Response;

          vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

          // fetchData should throw a FetchError
          try {
            await fetchData(url);
            expect.fail("fetchData should have thrown a FetchError");
          } catch (error: unknown) {
            // Verify thrown error is instanceof FetchError
            expect(error).toBeInstanceOf(FetchError);
            expect(error).toBeInstanceOf(Error);

            const fetchError = error as FetchError;

            // Verify error.status equals the response status code
            expect(fetchError.status).toBe(status);

            // Verify error.url equals the URL argument passed to fetchData
            expect(fetchError.url).toBe(url);

            // Verify error.message is a non-empty string containing the numeric status code
            expect(fetchError.message.length).toBeGreaterThan(0);
            expect(fetchError.message).toContain(String(status));
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});
