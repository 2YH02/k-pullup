"use client";

import { type Device } from "@/app/mypage/page";
import Text from "@common/text";
import cn from "@lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";

export interface Menu {
  name: string;
  icon?: React.ReactNode;
  iconActive?: React.ReactNode;
  path: string;
  isPrimary?: boolean;
}

interface BottomNavProps {
  /**
   * nav 리스트
   */
  menus: Menu[];
  /**
   * 넓이 (full: 100%)
   */
  width?: number | "full";
  /**
   * 기기 타입
   */
  deviceType?: Device;
  /**
   * tailwind 스타일 클래스
   */
  className?: React.ComponentProps<"nav">["className"];
}

const BottomNav = ({
  menus,
  width = "full",
  deviceType = "desktop",
  className,
}: BottomNavProps) => {
  const pathname = usePathname();

  const navWidth = useMemo(() => {
    if (width === "full") return "w-full";

    return `w-[${width}px]`;
  }, [width]);

  const isMobileApp = deviceType === "ios-mobile-app";

  const navStyle = isMobileApp ? "fixed h-18 pb-3" : "h-14";
  const primaryMenu = menus.find((menu) => menu.isPrimary);
  const secondaryMenus = menus.filter((menu) => !menu.isPrimary);
  const leftMenus = secondaryMenus.slice(0, 2);
  const rightMenus = secondaryMenus.slice(2);
  const isPrimaryActive = primaryMenu ? pathname === primaryMenu.path : false;

  return (
    <div
      className={cn(
        `sticky bottom-0 z-30 overflow-visible ${isMobileApp ? "h-18 pb-3" : "h-14"}`,
        navWidth,
        className,
        navStyle
      )}
    >
      <nav className="relative h-full overflow-visible border-t border-primary/12 bg-surface/94 backdrop-blur-sm dark:bg-black/84 dark:border-white/10 web:rounded-b-lg">
        <ul className="relative z-20 grid h-full grid-cols-5 items-end px-2 pb-1">
          {leftMenus.map((menu) => (
            <NavLink
              key={menu.name}
              title={menu.name}
              icon={pathname === menu.path ? menu.iconActive : menu.icon}
              url={menu.path}
              pathname={pathname}
            />
          ))}
          <li className="h-full" aria-hidden />
          {rightMenus.map((menu) => (
            <NavLink
              key={menu.name}
              title={menu.name}
              icon={pathname === menu.path ? menu.iconActive : menu.icon}
              url={menu.path}
              pathname={pathname}
            />
          ))}
        </ul>
      </nav>

      {primaryMenu && (
        <Link
          href={primaryMenu.path}
          className="absolute left-1/2 top-0 z-40 flex -translate-x-1/2 -translate-y-[18%] flex-col items-center focus-visible:outline-hidden"
          aria-label={primaryMenu.name}
        >
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border border-white/75 shadow-[0_6px_14px_rgba(64,64,56,0.18)] transition-all duration-200 active:scale-[0.96] web:hover:-translate-y-0.5",
              isPrimaryActive
                ? "bg-primary dark:bg-primary-dark"
                : "bg-text-on-surface-muted dark:bg-grey-dark"
            )}
          >
            <span
              className={cn(
                "inline-flex transition-transform duration-200",
                isPrimaryActive ? "scale-105 rotate-3" : "scale-100 rotate-0",
                "active:scale-110 active:rotate-6"
              )}
            >
              {isPrimaryActive ? primaryMenu.iconActive : primaryMenu.icon}
            </span>
          </div>
          <Text
            typography="t7"
            display="block"
            textAlign="center"
            className={cn(
              "pt-0.5 text-[11px] transition-all duration-200",
              isPrimaryActive
                ? "text-primary dark:text-primary-light font-semibold"
                : "text-text-on-surface-muted dark:text-grey-light"
            )}
          >
            {primaryMenu.name}
          </Text>
        </Link>
      )}
    </div>
  );
};

const NavLink = memo(({
  title,
  icon,
  url,
  pathname,
}: {
  title: string;
  icon: React.ReactNode;
  animation?: boolean;
  url: string;
  pathname: string;
}) => {
  const isActive = pathname === url;

  return (
    <li className="relative z-20 h-full">
      <Link
        href={url}
        className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-0.5 pb-1 transition-transform duration-150 active:scale-[0.96] focus-visible:outline-hidden"
      >
        <div
          className={cn(
            "mb-0.5 h-0.5 w-4 rounded-full transition-colors duration-200",
            isActive ? "bg-primary/55 dark:bg-primary-light/65" : "bg-transparent"
          )}
        />
        <div
          className={cn(
            "z-20 flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "-translate-y-0.5 bg-primary/12 dark:bg-primary/20"
              : "bg-transparent"
          )}
        >
          {icon}
        </div>
        <Text
          typography="t7"
          display="block"
          textAlign="center"
          className={cn(
            "z-20 text-[11px] transition-all duration-200",
            isActive
              ? "text-primary dark:text-primary-light font-semibold"
              : "text-text-on-surface-muted dark:text-grey-light"
          )}
        >
          {title}
        </Text>
      </Link>
    </li>
  );
});

NavLink.displayName = "NavLink";

export default BottomNav;
