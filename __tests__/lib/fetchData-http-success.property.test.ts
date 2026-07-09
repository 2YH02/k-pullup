import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
          // Mock fetch to return a success response with ok: true
          const mockResponse = new Response(null, { status });
          vi.stubGlobal("fetch", vi.fn().mockResolvedValue(mockResponse));

          // fetchData should NOT throw
          const result = await fetchData(url);

          // Assert the returned value is a Response object
          expect(result).toBeInstanceOf(Response);

          // Assert the status matches the mocked status
          expect(result.status).toBe(status);
        }
      ),
      { numRuns: 20 }
    );
  });
});
