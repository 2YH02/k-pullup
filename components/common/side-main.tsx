"use client";

import ChatBubbleIcon from "@icons/chat-bubble-icon";
import HomeIcon from "@icons/home-icon";
import SignIcon from "@icons/sign-icon";
import UserIcon from "@icons/user-icon";
import Navigate from "@layout/navigate";
import cn from "@lib/cn";
import { useEffect, useState } from "react";
import Text from "./text";

interface SideMainProps {
  title?: string;
  withNav?: boolean;
  clasName?: string;
  children?: React.ReactNode;
}

const menus = [
  {
    name: "홈",
    icon: <HomeIcon />,
    iconActive: <HomeIcon color="#fff" />,
    path: "/",
  },
  {
    name: "채팅",
    icon: <ChatBubbleIcon />,
    iconActive: <ChatBubbleIcon color="#fff" />,
    path: "/chat",
  },
  {
    name: "등록",
    icon: <SignIcon />,
    iconActive: <SignIcon color="#fff" />,
    path: "/register",
  },
  {
    name: "내 정보",
    icon: <UserIcon />,
    iconActive: <UserIcon color="#fff" />,
    path: "/mypage",
  },
];

const SideMain = ({ title, withNav, clasName, children }: SideMainProps) => {
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

  return (
    <main
      className={cn(
        `absolute web:top-6 web:bottom-6 web:left-6 web:max-w-96 w-full web:rounded-lg web:translate-x-0 
        overflow-y-auto overflow-x-hidden web:scrollbar-thin shadow-md bg-grey-light dark:bg-black
        mo:bottom-0 mo:rounded-t-lg mo:no-touch mo:scrollbar-hidden`,
        clasName
      )}
      style={{ height: isMoblie ? `${sheetHeight}%` : "" }}
      onPointerDown={dragStart}
    >
      <div className="sticky top-0 py-3 bg-grey-light z-20 web:hidden">
        <div className="w-1/6 h-1 mx-auto rounded-lg bg-grey" />
      </div>
      <div
        className={`${
          withNav ? "px-4 pb-10" : "px-4"
        } min-h-[calc(100%-56px)] mo:min-h-[calc(100%-84px)] relative`}
      >
        <Text
          typography="t3"
          display="block"
          textAlign="center"
          className="pt-4"
        >
          {title}
        </Text>
        {children}
      </div>
      <Navigate menus={menus} width={"full"} navClass="" />
    </main>
  );
};

export default SideMain;
