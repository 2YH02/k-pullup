import { describe, it, expect, vi, afterEach } from "vitest";
import * as fc from "fast-check";
import fetchData from "@lib/fetchData";

/**
 * Property 3: HTTP success status returns Response
 *
 * For any HTTP response with status code in the range [200, 299],
 * calling fetchData SHALL return a Response object without throwing,
 * where the returned Response's status equals the original status code.
 *
 * **Validates: Requirements 2.9**
 */
describe("Feature: fetchdata-error-handling, Property 3: HTTP success status returns Response", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a Response object without throwing for any 2xx status", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 200, max: 299 }),
        fc.webUrl(),
        async (status, url) => {
          const mockResponse = new Response(null, {
            status,
            statusText: "OK",
          });

          vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue(mockResponse)
          );

          const result = await fetchData(url);

          expect(result).toBeInstanceOf(Response);
          expect(result.status).toBe(status);
        }
      ),
      { numRuns: 20 }
    );
  });
});
