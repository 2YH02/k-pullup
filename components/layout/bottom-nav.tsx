"use client";

import { type Device } from "@/app/mypage/page";
import Text from "@common/text";
import cn from "@lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

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

  const navStyle = isMobileApp ? "fixed h-20 pb-4" : "h-14";

  return (
    <nav
      className={cn(
        `sticky bottom-0 ${
          isMobileApp ? "h-20 pb-4" : "h-14"
        } shadow-dark bg-white dark:bg-black dark:border-t dark:border-grey-dark dark:border-solid`,
        navWidth,
        className,
        navStyle
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
    <li className="flex grow flex-col justify-center items-center relative w-1/4 h-full z-20">
      <Link
        href={url}
        className="w-full h-full relative flex flex-col justify-center cursor-pointer"
      >
        <div className="flex items-center justify-center z-20">{icon}</div>
        <Text
          typography="t7"
          display="block"
          textAlign="center"
          className={`${isActive ? "text-primary" : "text-grey"} z-20`}
        >
          {title}
        </Text>
      </Link>
    </li>
  );
};

export default BottomNav;
