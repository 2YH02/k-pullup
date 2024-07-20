"use client";

import ArrowLeftIcon from "@icons/arrow-left-icon";
import ChatBubbleIcon from "@icons/chat-bubble-icon";
import HomeIcon from "@icons/home-icon";
import SignIcon from "@icons/sign-icon";
import UserIcon from "@icons/user-icon";
import BottomNav from "@layout/bottom-nav";
import cn from "@lib/cn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Text from "./text";

interface SideMainProps {
  withNav?: boolean;
  className?: React.ComponentProps<"div">["className"];
  children?: React.ReactNode;
  headerTitle?: string;
  hasBackButton?: boolean;
  headerIcon?: React.ReactNode;
  headerIconClick?: VoidFunction;
}

const menus = [
  {
    name: "홈",
    icon: <HomeIcon />,
    iconActive: <HomeIcon className="fill-white" />,
    path: "/",
  },
  {
    name: "채팅",
    icon: <ChatBubbleIcon />,
    iconActive: <ChatBubbleIcon className="fill-white" />,
    path: "/chat",
  },
  {
    name: "등록",
    icon: <SignIcon />,
    iconActive: <SignIcon className="fill-white" />,
    path: "/register",
  },
  {
    name: "내 정보",
    icon: <UserIcon />,
    iconActive: <UserIcon className="fill-white" />,
    path: "/mypage",
  },
];

const SideMain = ({
  withNav,
  className,
  headerTitle,
  headerIcon,
  hasBackButton,
  headerIconClick,
  children,
}: SideMainProps) => {
  const [sheetHeight, setSheetHeight] = useState(85);
  const [isMoblie, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 484);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const dragStart: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isMoblie) return;
    const startY = e.clientY;
    let newHeight: number;

    const dragMove = (e: PointerEvent) => {
      const delta = startY - e.clientY;
      newHeight = sheetHeight + (delta / window.innerHeight) * 100;

      if (newHeight >= 85) return;
      if (newHeight <= 20) return;

      setSheetHeight(newHeight);
    };

    const dragEnd = () => {
      document.onpointermove = null;
      document.onpointerup = null;

      if (newHeight < 35) setSheetHeight(20);
      else if (newHeight < 67) setSheetHeight(50);
      else setSheetHeight(85);
    };

    document.onpointermove = dragMove;
    document.onpointerup = dragEnd;
  };

  const getBodyHeight = () => {
    if (headerTitle) {
      return withNav ? "h-[calc(100%-96px)] mo:h-[calc(100%-84px)]" : "h-[calc(100%-40px)] mo:h-[calc(100%-28px)]";
    } else {
      return withNav ? "h-[calc(100%-56px)] mo:h-[calc(100%-84px)]" : "h-full mo:h-[calc(100%-28px)]";
    }
  };

  return (
    <main
      className={cn(
        `absolute web:top-6 web:bottom-6 web:left-6 web:max-w-96 w-full web:rounded-lg
        overflow-hidden shadow-md bg-grey-light dark:bg-black
        mo:bottom-0 mo:rounded-t-lg mo:no-touch mo:h-[85%]`,
        className
      )}
      style={{ height: isMoblie ? `${sheetHeight}%` : "" }}
      onPointerDown={dragStart}
    >
      {headerTitle && (
        <MainHeader
          titile={headerTitle}
          headerIcon={headerIcon}
          hasBackButton={hasBackButton}
          iconClick={headerIconClick}
        />
      )}
      <div className="sticky top-0 py-3 bg-grey-light dark:bg-black z-20 web:hidden">
        <div className="w-1/6 h-1 mx-auto rounded-lg bg-grey" />
      </div>

      <div
        className={cn(
          "mo:h-[calc(100%-86px)] overflow-auto web:scrollbar-thin mo:scrollbar-hidden",
          getBodyHeight()
        )}
      >
        {children}
      </div>
      {withNav && <BottomNav menus={menus} width={"full"} />}
    </main>
  );
};

interface MainHeaderProps {
  titile: string;
  headerIcon?: React.ReactNode;
  hasBackButton?: boolean;
  iconClick?: VoidFunction;
}

const MainHeader = ({
  titile,
  hasBackButton = false,
  headerIcon,
  iconClick,
}: MainHeaderProps) => {
  const router = useRouter();

  return (
    <div className="web:sticky mo:fixed top-0 left-0 flex items-center w-full h-10 shadow-sm z-20 bg-white dark:bg-grey-dark">
      <button
        className="flex items-center justify-center w-10 h-10"
        onClick={() => router.back()}
      >
        {hasBackButton && <ArrowLeftIcon color="black" />}
      </button>

      <Text typography="t5" fontWeight="bold" className="grow text-center">
        {titile}
      </Text>

      <button
        className="flex items-center justify-center w-10 h-10"
        onClick={iconClick}
      >
        {headerIcon && headerIcon}
      </button>
    </div>
  );
};

export default SideMain;
