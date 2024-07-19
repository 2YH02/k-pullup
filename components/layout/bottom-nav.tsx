"use client";

import Text from "@common/text";
import cn from "@lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const NAV_HEIGHT = 56;

export interface Menu {
  name: string;
  icon?: React.ReactNode;
  iconActive?: React.ReactNode;
  path: string;
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
   * tailwind 스타일 클래스
   */
  className?: React.ComponentProps<"nav">["className"];
}

const BottomNav = ({ menus, width = "full", className }: BottomNavProps) => {
  const pathname = usePathname();

  const navWidth = useMemo(() => {
    if (width === "full") return "w-full";

    return `w-[${width}px]`;
  }, [width]);

  return (
    <nav
      className={cn(
        "sticky bottom-0 h-14 shadow-lg bg-white dark:bg-grey-dark",
        navWidth,
        className
      )}
    >
      <ul className="relative flex justify-around items-center h-full">
        {menus.map((menu) => (
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
  );
};

const NavLink = ({
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
    <li className="flex flex-col justify-center items-center relative w-1/4 h-full z-20">
      {isActive && (
        <span
          className={`absolute bg-primary shadow-dark dark:bg-grey h-12 w-12 rounded-full origin-center animate-grow`}
        />
      )}

      <Link
        href={url}
        className="w-full h-full relative flex flex-col justify-center cursor-pointer"
      >
        <div className="flex items-center justify-center z-20">{icon}</div>
        <Text
          typography="t7"
          display="block"
          textAlign="center"
          fontWeight="bold"
          className={`${
            isActive ? "text-white" : "text-primary-dark dark:text-grey-light"
          } z-20`}
        >
          {title}
        </Text>
      </Link>
    </li>
  );
};

export default BottomNav;
