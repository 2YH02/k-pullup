// @vitest-environment happy-dom
// Feature: ui-ux-improvements, Property 4: Alert 포커스 복원
// **Validates: Requirements 6.4**

import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { render, cleanup } from "@testing-library/react";
import React from "react";

// Mock useAlertStore
const closeAlertMock = vi.fn();
vi.mock("@store/useAlertStore", () => ({
  default: () => ({ closeAlert: closeAlertMock }),
}));

import Alert from "@common/alert";

/**
 * Property 4: Alert 포커스 복원
 *
 * For any DOM element that has focus before the Alert modal opens,
 * when the modal is closed, focus must be restored to that original element.
 *
 * **Validates: Requirements 6.4**
 */

// Trigger element types that can receive focus
const triggerElementTypes = [
  "button",
  "input",
  "a",
  "textarea",
  "select",
  "div-tabindex",
] as const;

type TriggerElementType = (typeof triggerElementTypes)[number];

const createTriggerElement = (type: TriggerElementType): HTMLElement => {
  let element: HTMLElement;

  switch (type) {
    case "button":
      element = document.createElement("button");
      element.textContent = "Trigger Button";
      break;
    case "input":
      element = document.createElement("input");
      (element as HTMLInputElement).type = "text";
      break;
    case "a":
      element = document.createElement("a");
      (element as HTMLAnchorElement).href = "#";
      element.textContent = "Trigger Link";
      break;
    case "textarea":
      element = document.createElement("textarea");
      break;
    case "select":
      element = document.createElement("select");
      const option = document.createElement("option");
      option.textContent = "Option 1";
      element.appendChild(option);
      break;
    case "div-tabindex":
      element = document.createElement("div");
      element.setAttribute("tabindex", "0");
      element.textContent = "Focusable Div";
      break;
  }

  element.setAttribute("data-testid", "trigger-element");
  return element;
};

describe("Feature: ui-ux-improvements, Property 4: Alert 포커스 복원", () => {
  it("focus is restored to the previously focused element after alert is closed", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...triggerElementTypes),
        (triggerType) => {
          cleanup();
          closeAlertMock.mockClear();

          // Create and append trigger element to the document body
          const triggerElement = createTriggerElement(triggerType);
          document.body.appendChild(triggerElement);

          // Focus the trigger element before opening the alert
          triggerElement.focus();
          expect(document.activeElement).toBe(triggerElement);

          // Render Alert with open=true (alert saves previous focus and moves focus inside)
          const { rerender } = render(
            <Alert
              open={true}
              title="Test Alert"
              description="Test description"
              onClick={() => {}}
              cancel={true}
            />
          );

          // Re-render with open=false to trigger cleanup (focus restoration)
          rerender(
            <Alert
              open={false}
              title="Test Alert"
              description="Test description"
              onClick={() => {}}
              cancel={true}
            />
          );

          // Focus should be restored to the original trigger element
          expect(document.activeElement).toBe(triggerElement);

          // Cleanup: remove trigger element from DOM
          document.body.removeChild(triggerElement);
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("focus restoration works regardless of trigger element type combination", () => {
    fc.assert(
      fc.property(
        // Generate a sequence of open/close cycles with different trigger types
        fc.array(fc.constantFrom(...triggerElementTypes), {
          minLength: 1,
          maxLength: 5,
        }),
        (triggerSequence) => {
          cleanup();
          closeAlertMock.mockClear();

          // Test each trigger type in the sequence
          for (const triggerType of triggerSequence) {
            const triggerElement = createTriggerElement(triggerType);
            document.body.appendChild(triggerElement);

            // Focus the trigger element
            triggerElement.focus();
            expect(document.activeElement).toBe(triggerElement);

            // Open the alert
            const { rerender, unmount } = render(
              <Alert
                open={true}
                title="Test Alert"
                description="Description"
                onClick={() => {}}
              />
            );

            // Close the alert
            rerender(
              <Alert
                open={false}
                title="Test Alert"
                description="Description"
                onClick={() => {}}
              />
            );

            // Verify focus is restored
            expect(document.activeElement).toBe(triggerElement);

            // Cleanup for this iteration
            unmount();
            document.body.removeChild(triggerElement);
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
