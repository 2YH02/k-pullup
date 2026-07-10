// @vitest-environment happy-dom
// Feature: ui-ux-improvements, Property 2: InputField aria-describedby 고유 연결
// **Validates: Requirements 2.1, 2.5**

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import InputField from "@common/input-field";

/**
 * Property 2: InputField aria-describedby 고유 연결
 *
 * For any N (N≥2) InputField instances rendered on the same page with non-empty
 * error messages, each instance's error message element id must be unique,
 * and each input's aria-describedby must reference exactly its own error message id.
 *
 * **Validates: Requirements 2.1, 2.5**
 */

// Mock next/navigation since Input component uses useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

describe("Feature: ui-ux-improvements, Property 2: InputField aria-describedby 고유 연결", () => {
  it("all error message element ids are unique across N instances when isError=true", () => {
    fc.assert(
      fc.property(
        // Generate N (2 to 8) instances with random error messages
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
          minLength: 2,
          maxLength: 8,
        }),
        (errorMessages) => {
          cleanup();

          const { container } = render(
            <div>
              {errorMessages.map((msg, idx) => (
                <InputField
                  key={idx}
                  isError={true}
                  message={msg}
                  label={`Field ${idx}`}
                />
              ))}
            </div>
          );

          // Collect all error message element ids (elements with role="alert")
          const alertElements = container.querySelectorAll('[role="alert"]');
          const ids = Array.from(alertElements)
            .map((el) => el.getAttribute("id"))
            .filter((id): id is string => id !== null);

          // All ids must be unique
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);
          expect(ids.length).toBe(errorMessages.length);

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("each input's aria-describedby references exactly its own error message id", () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
          minLength: 2,
          maxLength: 8,
        }),
        (errorMessages) => {
          cleanup();

          const { container } = render(
            <div>
              {errorMessages.map((msg, idx) => (
                <InputField
                  key={idx}
                  isError={true}
                  message={msg}
                  label={`Field ${idx}`}
                />
              ))}
            </div>
          );

          const inputs = container.querySelectorAll("input");
          const alertElements = container.querySelectorAll('[role="alert"]');

          expect(inputs.length).toBe(errorMessages.length);
          expect(alertElements.length).toBe(errorMessages.length);

          // Each input's aria-describedby must reference exactly its sibling error element's id
          inputs.forEach((input, idx) => {
            const describedBy = input.getAttribute("aria-describedby");
            const errorElement = alertElements[idx];
            const errorId = errorElement.getAttribute("id");

            expect(describedBy).toBeTruthy();
            expect(errorId).toBeTruthy();
            expect(describedBy).toBe(errorId);

            // Verify the referenced element actually exists in the DOM
            const referencedEl = container.querySelector(`#${CSS.escape(describedBy!)}`);
            expect(referencedEl).not.toBeNull();
            // And it contains the correct error message text
            expect(referencedEl!.textContent).toBe(errorMessages[idx]);
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("when isError=false, no aria-describedby is set on the input", () => {
    fc.assert(
      fc.property(
        // Generate random combinations of isError states (mix of true/false)
        fc.array(
          fc.record({
            isError: fc.boolean(),
            message: fc.string({ minLength: 1, maxLength: 50 }),
          }),
          { minLength: 2, maxLength: 8 }
        ),
        (fieldConfigs) => {
          cleanup();

          const { container } = render(
            <div>
              {fieldConfigs.map((config, idx) => (
                <InputField
                  key={idx}
                  isError={config.isError}
                  message={config.message}
                  label={`Field ${idx}`}
                />
              ))}
            </div>
          );

          const inputs = container.querySelectorAll("input");

          inputs.forEach((input, idx) => {
            const describedBy = input.getAttribute("aria-describedby");
            const config = fieldConfigs[idx];

            if (config.isError) {
              // When isError=true with non-empty message, aria-describedby should be set
              expect(describedBy).toBeTruthy();
            } else {
              // When isError=false, aria-describedby should NOT be set
              expect(describedBy).toBeNull();
            }
          });

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
