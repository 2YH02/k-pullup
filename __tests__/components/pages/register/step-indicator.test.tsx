/**
 * @vitest-environment happy-dom
 */

/**
 * Unit tests for StepIndicator component
 *
 * Validates: Requirements 4.1, 4.2, 4.3
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

import StepIndicator from "@/components/pages/register/step-indicator";

describe("StepIndicator", () => {
  it("step 0일 때 첫 번째 세그먼트만 활성 색상이다", () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 0 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    const segments = progressbar!.querySelectorAll("div");

    // 첫 번째 세그먼트: 활성
    expect(segments[0].className).toContain("bg-primary");
    expect(segments[0].className).toContain("dark:bg-primary-light");

    // 나머지 세그먼트: 비활성
    expect(segments[1].className).toContain("bg-grey-light");
    expect(segments[1].className).toContain("dark:bg-grey-dark");
    expect(segments[2].className).toContain("bg-grey-light");
    expect(segments[3].className).toContain("bg-grey-light");
  });

  it("step 3일 때 모든 세그먼트가 활성 색상이다", () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 3 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    const segments = progressbar!.querySelectorAll("div");

    for (let i = 0; i < 4; i++) {
      expect(segments[i].className).toContain("bg-primary");
      expect(segments[i].className).toContain("dark:bg-primary-light");
    }
  });

  it("aria-valuenow가 currentStep + 1로 설정된다", () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 2 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar!.getAttribute("aria-valuenow")).toBe("3");
  });

  it("aria-valuemin=1, aria-valuemax=4가 설정된다", () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 0 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar!.getAttribute("aria-valuemin")).toBe("1");
    expect(progressbar!.getAttribute("aria-valuemax")).toBe("4");
  });

  it("aria-label이 올바른 단계 정보를 포함한다", () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 1 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar!.getAttribute("aria-label")).toBe("4단계 중 2단계");
  });

  it('role="progressbar"가 설정된다', () => {
    const { container } = render(
      React.createElement(StepIndicator, { currentStep: 0 })
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).not.toBeNull();
  });
});
