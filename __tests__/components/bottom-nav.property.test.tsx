// @vitest-environment happy-dom
// Feature: ui-ux-improvements, Property 1: BottomNav aria-current 정합성
import { describe, it, expect, vi, afterEach } from "vitest";
import * as fc from "fast-check";
import { render, cleanup } from "@testing-library/react";

/**
 * Property 1: BottomNav aria-current 정합성
 *
 * For any 메뉴 목록과 현재 경로 조합에서, 경로가 정확히 일치하는 링크만
 * `aria-current="page"`를 가져야 하며, 불일치하는 모든 링크에는
 * `aria-current` 속성이 DOM에 존재하지 않아야 한다.
 * 이 규칙은 secondary 메뉴와 primary 메뉴(FAB) 모두에 동일하게 적용된다.
 *
 * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
 */

// Mock next/navigation usePathname
let mockPathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// Mock next/link to render a simple anchor
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} data-testid="nav-link" {...props}>
      {children}
    </a>
  ),
}));

import BottomNav, { type Menu } from "@layout/bottom-nav";

afterEach(() => {
  cleanup();
});

// Arbitrary: generate a valid URL path segment (lowercase letters + digits + hyphen)
const pathSegmentArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,7}$/);

// Generate a path like /segment
const pathArb = pathSegmentArb.map((seg) => `/${seg}`);

// Generate a set of 5 unique menu paths (required: grid-cols-5 layout needs exactly 5)
// One will be primary (FAB), four will be secondary
const menuSetArb = fc
  .uniqueArray(pathArb, { minLength: 5, maxLength: 5, comparator: "IsStrictlyEqual" })
  .map((paths) => {
    const menus: Menu[] = paths.map((p, i) => ({
      name: `menu-${i}`,
      path: p,
      isPrimary: i === 2, // middle one is primary (FAB)
    }));
    return menus;
  });

describe("Feature: ui-ux-improvements, Property 1: BottomNav aria-current 정합성", () => {
  it("경로 일치 링크만 aria-current='page', 불일치 링크에는 aria-current 미존재 (secondary + primary)", () => {
    fc.assert(
      fc.property(
        menuSetArb,
        fc.nat({ max: 5 }), // index to pick current path (5 = no match)
        (menus, activeIndex) => {
          // Determine current path: either a menu path or an unmatched path
          const currentPath =
            activeIndex < menus.length
              ? menus[activeIndex].path
              : "/no-match-path-xyz";
          mockPathname = currentPath;

          const { container } = render(<BottomNav menus={menus} />);

          // Collect all rendered anchor links
          const allLinks = Array.from(container.querySelectorAll("a[href]"));
          expect(allLinks.length).toBeGreaterThan(0);

          for (const link of allLinks) {
            const ariaCurrent = link.getAttribute("aria-current");

            // Determine which menu this link belongs to by checking against known menu paths
            // The component sets aria-current based on:
            // - NavLink (secondary): pathname === url → "page"
            // - Primary FAB: isPrimaryActive (pathname === primaryMenu.path) → "page"
            const primaryMenu = menus.find((m) => m.isPrimary);
            const ariaLabel = link.getAttribute("aria-label");

            // FAB primary link is identified by having aria-label
            const isFabLink = ariaLabel !== null;

            if (isFabLink) {
              // Primary menu link: aria-current based on pathname === primaryMenu.path
              if (primaryMenu && currentPath === primaryMenu.path) {
                expect(ariaCurrent).toBe("page");
              } else {
                expect(ariaCurrent).toBeNull();
              }
            } else {
              // Secondary menu link: aria-current based on pathname === link href
              const href = link.getAttribute("href");
              if (href === currentPath) {
                expect(ariaCurrent).toBe("page");
              } else {
                expect(ariaCurrent).toBeNull();
              }
            }
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("모든 경로가 현재 경로와 불일치하면 어떤 링크도 aria-current를 갖지 않음", () => {
    fc.assert(
      fc.property(
        menuSetArb,
        (menus) => {
          mockPathname = "/guaranteed-no-match-xyz";

          const { container } = render(<BottomNav menus={menus} />);

          const allLinks = Array.from(container.querySelectorAll("a[href]"));

          for (const link of allLinks) {
            const ariaCurrent = link.getAttribute("aria-current");
            expect(ariaCurrent).toBeNull();
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("현재 경로와 일치하는 primary 메뉴(FAB)의 aria-current='page' 및 secondary 불일치 검증", () => {
    fc.assert(
      fc.property(
        menuSetArb,
        (menus) => {
          const primaryMenu = menus.find((m) => m.isPrimary);
          if (!primaryMenu) return;

          mockPathname = primaryMenu.path;

          const { container } = render(<BottomNav menus={menus} />);

          // FAB link (primary) should have aria-current="page"
          const fabLink = container.querySelector("a[aria-label]");
          expect(fabLink).not.toBeNull();
          expect(fabLink!.getAttribute("aria-current")).toBe("page");

          // Secondary links with different paths should NOT have aria-current
          const secondaryLinks = Array.from(container.querySelectorAll("li a[href]"));
          for (const link of secondaryLinks) {
            const href = link.getAttribute("href");
            const ariaCurrent = link.getAttribute("aria-current");
            if (href === primaryMenu.path) {
              expect(ariaCurrent).toBe("page");
            } else {
              expect(ariaCurrent).toBeNull();
            }
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
