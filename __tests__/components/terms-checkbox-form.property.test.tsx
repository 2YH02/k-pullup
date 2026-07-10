// Feature: ui-ux-improvements, Property 5: Terms 체크박스 키보드 토글 및 aria-checked 정합성

/**
 * @vitest-environment happy-dom
 */

/**
 * Property 5: Terms 체크박스 키보드 토글 및 aria-checked 정합성
 *
 * For any 체크박스 항목과 임의의 초기 상태(checked/unchecked)에서,
 * Enter 키 또는 Space 키 입력 후 체크 상태는 반전되어야 하며,
 * `aria-checked` 속성 값은 반전된 상태와 항상 일치해야 한다.
 * Space 키 입력 시 브라우저 기본 스크롤 동작은 방지(preventDefault)되어야 한다.
 *
 * **Validates: Requirements 9.2, 9.3, 9.4**
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, fireEvent, cleanup } from "@testing-library/react";
import React from "react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock next/image to render a simple img
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, width, height, className } = props;
    return React.createElement("img", {
      src,
      alt,
      width,
      height,
      className,
    });
  },
}));

import TermsCheckboxForm from "@/components/pages/terms/terms-checkbox-form";

// Key type for property generation
type KeyType = "Enter" | " ";

// Checkbox identifiers in the form
const CHECKBOX_IDS = [
  "agree-all",
  "agree-terms",
  "agree-age",
  "agree-privacy",
  "agree-location",
  "agree-marketing",
] as const;

type CheckboxId = (typeof CHECKBOX_IDS)[number];

// Arbitrary for key type
const keyArb = fc.constantFrom<KeyType>("Enter", " ");

// Arbitrary for checkbox id
const checkboxIdArb = fc.constantFrom<CheckboxId>(...CHECKBOX_IDS);

describe("Feature: ui-ux-improvements, Property 5: Terms 체크박스 키보드 토글 및 aria-checked 정합성", () => {
  beforeEach(() => {
    cleanup();
  });

  it("Enter/Space 키 입력 후 aria-checked 상태가 반전된다", () => {
    fc.assert(
      fc.property(checkboxIdArb, keyArb, (checkboxId, key) => {
        cleanup();

        const nextFn = vi.fn();
        const { container } = render(
          React.createElement(TermsCheckboxForm, { next: nextFn })
        );

        const checkbox = container.querySelector(`#${checkboxId}`);
        expect(checkbox).not.toBeNull();

        // Get initial aria-checked state
        const initialAriaChecked = checkbox!.getAttribute("aria-checked");
        expect(initialAriaChecked).toMatch(/^(true|false)$/);

        const expectedAfterToggle =
          initialAriaChecked === "true" ? "false" : "true";

        // Fire keydown event
        fireEvent.keyDown(checkbox!, { key });

        // Verify aria-checked is flipped
        const newAriaChecked = checkbox!.getAttribute("aria-checked");
        expect(newAriaChecked).toBe(expectedAfterToggle);
      }),
      { numRuns: 100 }
    );
  });

  it("반복적인 키 입력에서 aria-checked가 매번 반전된다", () => {
    fc.assert(
      fc.property(
        checkboxIdArb,
        fc.array(keyArb, { minLength: 1, maxLength: 10 }),
        (checkboxId, keys) => {
          cleanup();

          const nextFn = vi.fn();
          const { container } = render(
            React.createElement(TermsCheckboxForm, { next: nextFn })
          );

          const checkbox = container.querySelector(`#${checkboxId}`);
          expect(checkbox).not.toBeNull();

          let currentState = checkbox!.getAttribute("aria-checked") === "true";

          for (const key of keys) {
            fireEvent.keyDown(checkbox!, { key });
            currentState = !currentState;

            const ariaChecked = checkbox!.getAttribute("aria-checked");
            expect(ariaChecked).toBe(String(currentState));
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Space 키 입력 시 preventDefault가 호출된다", () => {
    fc.assert(
      fc.property(checkboxIdArb, (checkboxId) => {
        cleanup();

        const nextFn = vi.fn();
        const { container } = render(
          React.createElement(TermsCheckboxForm, { next: nextFn })
        );

        const checkbox = container.querySelector(`#${checkboxId}`);
        expect(checkbox).not.toBeNull();

        // Fire Space keydown and check defaultPrevented
        const event = new KeyboardEvent("keydown", {
          key: " ",
          bubbles: true,
          cancelable: true,
        });

        const preventDefaultSpy = vi.spyOn(event, "preventDefault");
        checkbox!.dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      }),
      { numRuns: 100 }
    );
  });

  it("Enter 키 입력 시 preventDefault가 호출되지 않거나 호출되어도 상태 반전은 정상적이다", () => {
    fc.assert(
      fc.property(checkboxIdArb, (checkboxId) => {
        cleanup();

        const nextFn = vi.fn();
        const { container } = render(
          React.createElement(TermsCheckboxForm, { next: nextFn })
        );

        const checkbox = container.querySelector(`#${checkboxId}`);
        expect(checkbox).not.toBeNull();

        const initialAriaChecked = checkbox!.getAttribute("aria-checked");
        const expectedAfterToggle =
          initialAriaChecked === "true" ? "false" : "true";

        // Fire Enter keydown
        fireEvent.keyDown(checkbox!, { key: "Enter" });

        // State should still flip correctly
        const newAriaChecked = checkbox!.getAttribute("aria-checked");
        expect(newAriaChecked).toBe(expectedAfterToggle);
      }),
      { numRuns: 100 }
    );
  });
});
