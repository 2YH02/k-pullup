// Feature: ui-ux-improvements, Property 3: Alert 포커스 트랩 순환

/**
 * @vitest-environment happy-dom
 */

/**
 * Property 3: Alert 포커스 트랩 순환
 *
 * For any N개(N≥1)의 포커스 가능 요소를 가진 Alert 모달에서,
 * 마지막 요소에 포커스가 있을 때 Tab 키를 누르면 첫 번째 요소로,
 * 첫 번째 요소에 포커스가 있을 때 Shift+Tab을 누르면 마지막 요소로 포커스가 이동해야 한다.
 *
 * **Validates: Requirements 6.2**
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, fireEvent, cleanup } from "@testing-library/react";
import React from "react";

// Mock useAlertStore
const closeAlertMock = vi.fn();
vi.mock("@store/useAlertStore", () => ({
  default: () => ({
    closeAlert: closeAlertMock,
  }),
}));

import Alert from "@/components/common/alert";

/**
 * Generates N focusable elements (buttons and inputs) as React content.
 */
const generateFocusableContents = (n: number): React.ReactNode => {
  const elements: React.ReactElement[] = [];
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      elements.push(
        React.createElement("button", {
          key: `btn-${i}`,
          "data-testid": `focusable-${i}`,
        }, `Button ${i}`)
      );
    } else {
      elements.push(
        React.createElement("input", {
          key: `input-${i}`,
          "data-testid": `focusable-${i}`,
          type: "text",
          placeholder: `Input ${i}`,
        })
      );
    }
  }
  return React.createElement(React.Fragment, null, ...elements);
};

describe("Feature: ui-ux-improvements, Property 3: Alert 포커스 트랩 순환", () => {
  beforeEach(() => {
    closeAlertMock.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("마지막 요소에서 Tab 키를 누르면 첫 번째 요소로 포커스가 이동한다", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (numElements) => {
          cleanup();
          closeAlertMock.mockClear();

          const contents = generateFocusableContents(numElements);

          const { container } = render(
            React.createElement(Alert, {
              open: true,
              contents,
            })
          );

          // Get all focusable elements inside the dialog
          const dialog = container.querySelector('[role="dialog"]');
          expect(dialog).not.toBeNull();

          const focusables = dialog!.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          expect(focusables.length).toBeGreaterThanOrEqual(numElements);

          const firstFocusable = focusables[0];
          const lastFocusable = focusables[focusables.length - 1];

          // Focus the last element
          lastFocusable.focus();
          expect(document.activeElement).toBe(lastFocusable);

          // Press Tab (not Shift) on document → should wrap to first
          fireEvent.keyDown(document, {
            key: "Tab",
            code: "Tab",
            shiftKey: false,
          });

          expect(document.activeElement).toBe(firstFocusable);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("첫 번째 요소에서 Shift+Tab 키를 누르면 마지막 요소로 포커스가 이동한다", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        (numElements) => {
          cleanup();
          closeAlertMock.mockClear();

          const contents = generateFocusableContents(numElements);

          const { container } = render(
            React.createElement(Alert, {
              open: true,
              contents,
            })
          );

          // Get all focusable elements inside the dialog
          const dialog = container.querySelector('[role="dialog"]');
          expect(dialog).not.toBeNull();

          const focusables = dialog!.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          expect(focusables.length).toBeGreaterThanOrEqual(numElements);

          const firstFocusable = focusables[0];
          const lastFocusable = focusables[focusables.length - 1];

          // Focus the first element
          firstFocusable.focus();
          expect(document.activeElement).toBe(firstFocusable);

          // Press Shift+Tab on document → should wrap to last
          fireEvent.keyDown(document, {
            key: "Tab",
            code: "Tab",
            shiftKey: true,
          });

          expect(document.activeElement).toBe(lastFocusable);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Tab/Shift+Tab 순환이 여러 번 연속으로 올바르게 동작한다", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 6 }),
        fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }),
        (numElements, tabDirections) => {
          cleanup();
          closeAlertMock.mockClear();

          const contents = generateFocusableContents(numElements);

          const { container } = render(
            React.createElement(Alert, {
              open: true,
              contents,
            })
          );

          const dialog = container.querySelector('[role="dialog"]');
          expect(dialog).not.toBeNull();

          const focusables = dialog!.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const totalFocusables = focusables.length;
          expect(totalFocusables).toBeGreaterThanOrEqual(numElements);

          // Start from the first element
          focusables[0].focus();

          for (const isShiftTab of tabDirections) {
            const currentActive = document.activeElement;

            // Determine if this is a boundary case
            const isAtFirst = currentActive === focusables[0];
            const isAtLast = currentActive === focusables[totalFocusables - 1];

            if (isShiftTab && isAtFirst) {
              // Shift+Tab from first → should go to last
              fireEvent.keyDown(document, {
                key: "Tab",
                code: "Tab",
                shiftKey: true,
              });
              expect(document.activeElement).toBe(focusables[totalFocusables - 1]);
            } else if (!isShiftTab && isAtLast) {
              // Tab from last → should go to first
              fireEvent.keyDown(document, {
                key: "Tab",
                code: "Tab",
                shiftKey: false,
              });
              expect(document.activeElement).toBe(focusables[0]);
            } else {
              // Non-boundary Tab/Shift+Tab: browser handles focus naturally
              // In test environment, focus doesn't move on its own for non-boundary cases
              // So we just ensure no error occurs and move focus manually for next iteration
              fireEvent.keyDown(document, {
                key: "Tab",
                code: "Tab",
                shiftKey: isShiftTab,
              });

              // In non-boundary cases, browser would move focus but testing-library won't.
              // Manually simulate what the browser would do for non-boundary Tab navigation.
              if (!isShiftTab) {
                // Find current index and move to next
                const currentIdx = Array.from(focusables).indexOf(
                  currentActive as HTMLElement
                );
                if (currentIdx >= 0 && currentIdx < totalFocusables - 1) {
                  focusables[currentIdx + 1].focus();
                }
              } else {
                // Shift+Tab: move to previous
                const currentIdx = Array.from(focusables).indexOf(
                  currentActive as HTMLElement
                );
                if (currentIdx > 0) {
                  focusables[currentIdx - 1].focus();
                }
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
