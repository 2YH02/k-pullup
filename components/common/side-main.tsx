"use client";

import { type Device } from "@/app/mypage/page";
import ArrowLeftIcon from "@icons/arrow-left-icon";
import ArrowRightIcon from "@icons/arrow-right-icon";
import BottomNav from "@layout/bottom-nav";
import cn from "@lib/cn";
import useScrollRefStore from "@store/useScrollRefStore";
import useSheetHeightStore from "@store/useSheetHeightStore";
import { House, MessageCircle, Plus, Trophy, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SheetHeightProvider from "../provider/sheet-height-provider";
import Text from "./text";

interface SideMainProps {
  withNav?: boolean;
  className?: React.ComponentProps<"div">["className"];
  children?: React.ReactNode;
  headerTitle?: string;
  hasBackButton?: boolean;
  headerIcon?: React.ReactNode;
  fullHeight?: boolean;
  headerPosition?: "sticky" | "fixed";
  background?: "white" | "grey";
  dragable?: boolean;
  referrer?: boolean;
  deviceType?: Device;
  bodyStyle?: string;
  headerIconClick?: VoidFunction;
  prevClick?: VoidFunction;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

const menus = [
  {
    name: "홈",
    icon: <House size={20} strokeWidth={2} className="text-text-on-surface-muted dark:text-grey" />,
    iconActive: <House size={20} strokeWidth={2.2} className="text-primary dark:text-primary-light" />,
    path: "/",
  },
  {
    name: "소셜",
    icon: <MessageCircle size={20} strokeWidth={2} className="text-text-on-surface-muted dark:text-grey" />,
    iconActive: <MessageCircle size={20} strokeWidth={2.2} className="text-primary dark:text-primary-light" />,
    path: "/social",
  },
  {
    name: "등록",
    icon: <Plus size={28} strokeWidth={2.4} className="text-white" />,
    iconActive: <Plus size={28} strokeWidth={2.6} className="text-white" />,
    path: "/register",
    isPrimary: true,
  },
  {
    name: "챌린지",
    icon: <Trophy size={20} strokeWidth={2} className="text-text-on-surface-muted dark:text-grey" />,
    iconActive: <Trophy size={20} strokeWidth={2.2} className="text-primary dark:text-primary-light" />,
    path: "/challenge",
  },
  {
    name: "내 정보",
    icon: <UserRound size={20} strokeWidth={2} className="text-text-on-surface-muted dark:text-grey" />,
    iconActive: <UserRound size={20} strokeWidth={2.2} className="text-primary dark:text-primary-light" />,
    path: "/mypage",
  },
];

const SideMain = ({
  withNav,
  className,
  headerTitle,
  headerIcon,
  hasBackButton,
  fullHeight,
  headerPosition,
  background = "white",
  dragable = true,
  headerIconClick,
  prevClick,
  children,
  deviceType,
  bodyStyle,
  onScroll,
  referrer = true,
}: SideMainProps) => {
  const { sheetHeight, curHeight, setCurHeight } = useSheetHeightStore();
  const { setContainerRef } = useScrollRefStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setContainerRef(containerRef);
  }, [setContainerRef]);

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
    if (!isMobile || fullHeight || !dragable) return;

    const startY = e.clientY;

    let newHeight: number;

    const dragMove = (e: PointerEvent) => {
      const delta = startY - e.clientY;

      newHeight = curHeight + (delta / window.innerHeight) * 100;

      if (newHeight >= sheetHeight.STEP_3.height) {
        newHeight = sheetHeight.STEP_3.height;
      } else if (newHeight <= sheetHeight.STEP_1.height) {
        newHeight = sheetHeight.STEP_1.height;
      }
      setCurHeight(newHeight);
    };

    const dragEnd = () => {
      if (newHeight <= sheetHeight.STEP_1.max) {
        setCurHeight(sheetHeight.STEP_1.height);
      } else if (newHeight <= sheetHeight.STEP_2.max) {
        setCurHeight(sheetHeight.STEP_2.height);
      } else {
        setCurHeight(sheetHeight.STEP_3.height);
      }

      document.onpointermove = null;
      document.onpointerup = null;
    };

    document.onpointermove = dragMove;
    document.onpointerup = dragEnd;
  };

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";
  const layoutClass = fullHeight
    ? "mo:inset-0 mo:h-dvh mo:w-dvw web:top-1/2 web:-translate-y-1/2 web:h-[90%] web:left-6 web:max-w-96 w-full web:max-h-185"
    : `mo:bottom-0 web:top-1/2 web:-translate-y-1/2 web:h-[90%] web:left-6 web:max-w-96 w-full web:max-h-185 ${
        isMobileApp ? "mo:h-[80%]" : "mo:h-[85%]"
      }`;

  if (hide) {
    return (
      <button
        className="absolute top-10 left-10 flex items-center justify-center rounded-full shadow-dark w-20 h-10 bg-side-main dark:bg-black z-50"
        onClick={() => setHide(false)}
      >
        <MapIcon />
        <ArrowRightIcon size={24} />
      </button>
    );
  }

  return (
    <SheetHeightProvider deviceType={deviceType as Device}>
      <main
        className={cn(
          `fixed flex flex-col z-10 mo:no-touch select-none ${layoutClass} ${
            fullHeight
              ? "shadow-dark web:rounded-lg"
              : "shadow-dark web:rounded-lg mo:rounded-t-4xl"
          }`,
          background === "white"
            ? "bg-side-main dark:bg-black"
            : "bg-grey-light dark:bg-black",
          className
        )}
        style={{ height: isMobile && !fullHeight ? `${curHeight}%` : "" }}
      >
        <button
          className="absolute top-3 -right-12 flex items-center justify-center 
        rounded-r-2xl shadow-simple w-12 h-10 bg-side-main dark:bg-black z-50 mo:hidden"
          onClick={() => setHide(true)}
        >
          <ArrowLeftIcon size={24} />
        </button>

        {headerTitle && (
          <MainHeader
            titile={headerTitle}
            headerIcon={headerIcon}
            hasBackButton={hasBackButton}
            headerPosition={headerPosition}
            iconClick={headerIconClick}
            prevClick={prevClick}
            referrer={referrer}
            deviceType={deviceType}
          />
        )}

        {!fullHeight && dragable && (
          <div
            className="sticky top-0 py-3 bg-side-main dark:bg-black z-20 rounded-t-3xl web:hidden cursor-grab active:cursor-grabbing"
            onPointerDown={dragStart}
            role="button"
            aria-label="드로워 높이 조절"
            tabIndex={0}
          >
            <div className="w-1/6 h-1 mx-auto rounded-lg bg-grey" />
          </div>
        )}

        <div
          ref={containerRef}
          className={cn(
            "grow overflow-y-auto overflow-x-hidden web:rounded-lg web:scrollbar-thin mo:scrollbar-hidden",
            withNav ? "pb-20 mo:pb-24" : "pb-12",
            headerTitle && fullHeight
              ? isMobileApp
                ? "mo:pt-24"
                : "mo:pt-10"
              : "",
            deviceType === "ios-mobile-app" && withNav ? "pb-28" : "",
            bodyStyle
          )}
          onScroll={onScroll}
        >
          {children}
        </div>

        {withNav && (
          <div className="shrink-0 overflow-visible web:rounded-lg border-t border-solid dark:border-grey-dark">
            <BottomNav menus={menus} width={"full"} deviceType={deviceType} />
          </div>
        )}
      </main>
    </SheetHeightProvider>
  );
};

interface MainHeaderProps {
  titile: string;
  headerIcon?: React.ReactNode;
  hasBackButton?: boolean;
  headerPosition?: "sticky" | "fixed";
  referrer?: boolean;
  deviceType?: Device;
  iconClick?: VoidFunction;
  prevClick?: VoidFunction;
}

const MainHeader = ({
  titile,
  hasBackButton = false,
  headerIcon,
  headerPosition,
  referrer,
  deviceType,
  iconClick,
  prevClick,
}: MainHeaderProps) => {
  const router = useRouter();

  const style =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app"
      ? "pt-12 h-24"
      : "";

  const getHeaderPosition = () => {
    if (headerPosition === "sticky") return "web:sticky mo:sticky";
    if (headerPosition === "fixed") return "web:fixed mo:fixed";
  };

  return (
    <div
      className={cn(
        `shrink-0 web:sticky mo:fixed top-0 left-0 flex items-center w-full h-10 shadow-xs z-20 bg-side-main 
        dark:bg-black dark:border-b dark:border-solid dark:border-grey-dark web:rounded-t-lg`,
        getHeaderPosition(),
        style
      )}
    >
      {hasBackButton ? (
        <button
          className={`flex items-center justify-center shrink-0 w-10 h-10 ${
            hasBackButton ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={
            hasBackButton
              ? prevClick
                ? prevClick
                : referrer
                ? () => router.back()
                : () => router.push("/")
              : undefined
          }
        >
          {hasBackButton && <ArrowLeftIcon color="black" />}
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}

      <Text
        typography="t5"
        fontWeight="bold"
        className="grow text-center truncate select-none"
      >
        {titile}
      </Text>

      {iconClick ? (
        <button
          className={`flex items-center shrink-0 justify-center w-10 h-10`}
          onClick={iconClick}
        >
          {headerIcon && headerIcon}
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}
    </div>
  );
};

const MapIcon = () => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className="fill-current stroke-current"
      height={30}
      width={30}
    >
      <g className="fill-[#28527a] stroke-none">
        <path d="M29.057,8.284c-1.49,-0.596 -5.206,-2.082 -6.454,-2.581c-0.398,-0.16 -0.845,-0.141 -1.228,0.051l-5.391,2.695c-0,0 -6.45,-2.764 -6.45,-2.764c-0.326,-0.14 -0.692,-0.159 -1.032,-0.055l-5.443,1.675c-0.63,0.194 -1.059,0.775 -1.059,1.434c0,2.738 0,12.334 0,15.907c0,0.476 0.226,0.924 0.609,1.207c0.383,0.282 0.877,0.367 1.332,0.227l4.922,-1.515c0.093,-0.028 0.192,-0.029 0.285,-0.003c-0,0 6.417,1.834 6.417,1.834c0.291,0.083 0.6,0.076 0.887,-0.019l5.487,-1.83c0.072,-0.024 0.149,-0.031 0.224,-0.021c0,0 6.139,0.819 6.139,0.819c0.428,0.057 0.861,-0.074 1.186,-0.359c0.325,-0.284 0.512,-0.696 0.512,-1.128c0,-3.118 0,-11.704 -0,-14.181c0,-0.613 -0.373,-1.165 -0.943,-1.393l0,0Z" />
        <path
          d="M4.003,26.061c-0.139,-0.049 -0.272,-0.119 -0.393,-0.208c-0.383,-0.283 -0.609,-0.731 -0.609,-1.207c0,-3.573 0,-13.169 0,-15.907c0,-0.659 0.43,-1.24 1.059,-1.434l5.382,-1.656c-0.302,-0.107 -0.632,-0.114 -0.94,-0.019l-5.443,1.675c-0.63,0.194 -1.059,0.775 -1.059,1.434c0,2.738 0,12.334 0,15.907c0,0.476 0.226,0.924 0.609,1.207c0.383,0.282 0.877,0.367 1.332,0.227l0.062,-0.019Z"
          className="fill-[#063c6f]"
        />
        <path
          d="M21.797,5.616c0.104,0.018 0.208,0.046 0.308,0.087c1.249,0.499 4.964,1.985 6.454,2.581l0,0c0.57,0.228 0.943,0.78 0.943,1.393c0,2.477 0,11.063 0,14.181c0,0.432 -0.186,0.844 -0.512,1.128c-0.212,0.186 -0.469,0.306 -0.742,0.351l0.054,0.008c0.428,0.057 0.861,-0.074 1.186,-0.359c0.325,-0.284 0.512,-0.696 0.512,-1.128c0,-3.118 0,-11.704 -0,-14.181c0,-0.613 -0.373,-1.165 -0.943,-1.393l0,0c-1.49,-0.596 -5.206,-2.082 -6.454,-2.581c-0.259,-0.104 -0.537,-0.132 -0.806,-0.087Z"
          className="fill-[#3d668e]"
        />
        <path
          d="M28,10.5c0,-0.196 -0.115,-0.374 -0.293,-0.455l-5.5,-2.5c-0.137,-0.063 -0.296,-0.06 -0.431,0.008l-5.792,2.896c-0,0 -6.787,-2.909 -6.787,-2.909c-0.113,-0.048 -0.239,-0.053 -0.355,-0.014l-4.5,1.5c-0.204,0.068 -0.342,0.259 -0.342,0.474l0,14c0,0.161 0.077,0.312 0.208,0.406c0.13,0.094 0.298,0.119 0.45,0.068l4.371,-1.457c-0,0 6.866,1.472 6.866,1.472c0.075,0.016 0.152,0.015 0.226,-0.004l5.896,-1.474c-0,0 5.394,0.981 5.394,0.981c0.145,0.026 0.296,-0.013 0.409,-0.108c0.114,-0.095 0.18,-0.236 0.18,-0.384l0,-12.5Z"
          className="fill-[#8ac4d0]"
        />
        <path
          d="M5.117,23.821c-0.075,-0.089 -0.117,-0.202 -0.117,-0.321l0,-14c0,-0.215 0.138,-0.406 0.342,-0.474l4.118,-1.373l-0.263,-0.113c-0.113,-0.048 -0.239,-0.053 -0.355,-0.014l-4.5,1.5c-0.204,0.068 -0.342,0.259 -0.342,0.474l-0,14c0,0.161 0.077,0.312 0.208,0.406c0.13,0.094 0.298,0.119 0.45,0.068l0.459,-0.153Z"
          className="fill-[#4ca4b6]"
        />
        <path
          d="M21.753,7.565l5.456,2.48c0.179,0.081 0.293,0.259 0.293,0.455l0,12.5c0,0.148 -0.066,0.289 -0.179,0.384c-0.035,0.029 -0.074,0.053 -0.114,0.071l0.202,0.037c0.145,0.026 0.296,-0.013 0.409,-0.108c0.114,-0.095 0.18,-0.236 0.18,-0.384l0,-12.5c0,-0.196 -0.115,-0.374 -0.293,-0.455l-5.5,-2.5c-0.137,-0.063 -0.296,-0.06 -0.431,0.008l-0.023,0.012Z"
          className="fill-[#9ee0ee]"
        />
        <path
          d="M28,19.5c0,-0.027 -0.002,-0.053 -0.006,-0.079c-0.041,-0.251 -0.183,-0.445 -0.437,-0.574c-0.263,-0.134 -0.746,-0.175 -1.291,-0.193c-0.437,-0.015 -0.926,-0.025 -1.312,-0.163c-0.244,-0.088 -0.435,-0.242 -0.455,-0.553c-0.037,-0.557 -0.262,-1.377 -0.721,-2.068c-0.489,-0.736 -1.232,-1.322 -2.255,-1.369c-1.214,-0.057 -1.775,0.545 -2.438,1.381c-0.779,0.984 -1.785,2.3 -5.133,2.62c-1.599,0.153 -2.219,1.249 -2.427,2.319c-0.189,0.974 -0.013,1.914 -0.013,1.914c0.037,0.198 0.189,0.355 0.387,0.397l3.996,0.857c0.075,0.016 0.152,0.015 0.227,-0.004l5.895,-1.477c-0,0 5.375,0.981 5.375,0.981c0.146,0.026 0.295,-0.013 0.409,-0.107c0.114,-0.094 0.18,-0.234 0.181,-0.381c0,-0 0.018,-2.231 0.018,-3.501Zm-24,-5c-0,0.06 0.011,0.119 0.032,0.175c-0,-0 0.702,2.122 4.507,1.823c0.967,-0.075 1.552,-0.316 1.944,-0.607c0.411,-0.305 0.622,-0.675 0.803,-1.038c0.115,-0.229 0.2,-0.461 0.406,-0.62c0.203,-0.157 0.515,-0.223 1.041,-0.204c1.201,0.042 1.9,-0.289 2.283,-0.725c0.395,-0.45 0.493,-1.044 0.387,-1.641c-0.141,-0.798 -0.653,-1.598 -1.101,-1.933c-0.649,-0.286 -5.133,-2.201 -5.133,-2.201c-0.105,-0.037 -0.221,-0.039 -0.327,-0.003l-4.5,1.5c-0.204,0.068 -0.342,0.259 -0.342,0.474l0,5Zm17.585,-1.706c0.421,0.882 1.268,1.776 2.043,2.074c0.345,0.132 0.682,0.158 0.984,0.07c0.316,-0.091 0.606,-0.303 0.825,-0.694c0.486,-0.872 0.275,-1.567 -0.124,-2.186c-0.282,-0.439 -0.7,-0.816 -0.841,-1.222c-0.556,-1.602 -2.298,-2.01 -3.544,-1.637c-0.948,0.284 -1.571,0.999 -1.421,1.885c0.138,0.815 0.722,1.212 1.327,1.445c0.264,0.102 0.637,0.227 0.751,0.265Z"
          className="fill-[#fbeeac]"
        />
        <path
          d="M16.47,23.898l-3.571,-0.766c-0.198,-0.042 -0.35,-0.199 -0.387,-0.397c-0,0 -0.176,-0.94 0.013,-1.914c0.208,-1.07 0.828,-2.166 2.427,-2.319c3.348,-0.32 4.354,-1.636 5.133,-2.62c0.532,-0.672 0.999,-1.193 1.793,-1.342c-0.114,-0.02 -0.232,-0.034 -0.355,-0.039c-1.214,-0.057 -1.775,0.545 -2.438,1.381c-0.779,0.984 -1.785,2.3 -5.133,2.62c-1.599,0.153 -2.219,1.249 -2.427,2.319c-0.189,0.974 -0.013,1.914 -0.013,1.914c0.037,0.198 0.189,0.355 0.387,0.397l3.996,0.857c0.075,0.016 0.152,0.015 0.227,-0.004l0.348,-0.087Zm11.332,-0.517l-4.785,-0.873l-0.422,0.106l4.797,0.875c0.146,0.026 0.295,-0.013 0.409,-0.107l0.001,-0.001Zm-19.461,-6.869c-2.76,-0.177 -3.309,-1.837 -3.309,-1.837c-0.021,-0.056 -0.032,-0.115 -0.032,-0.175l0,-5c0,-0.215 0.138,-0.406 0.342,-0.474l4.117,-1.373l-0.29,-0.124c-0.105,-0.037 -0.221,-0.039 -0.327,-0.003l-4.5,1.5c-0.204,0.068 -0.342,0.259 -0.342,0.474l0,5c-0,0.06 0.011,0.119 0.032,0.175c-0,-0 0.678,2.048 4.309,1.837Zm14.774,-1.918c0.281,0.077 0.535,0.198 0.763,0.352c0.257,0.06 0.506,0.059 0.734,-0.008c0.037,-0.01 0.073,-0.023 0.109,-0.037c-0.031,-0.01 -0.062,-0.021 -0.093,-0.033c-0.775,-0.298 -1.622,-1.192 -2.043,-2.074c-0.114,-0.038 -0.487,-0.163 -0.751,-0.265c-0.605,-0.233 -1.189,-0.63 -1.327,-1.445c-0.15,-0.886 0.473,-1.601 1.421,-1.885c0.129,-0.039 0.262,-0.069 0.399,-0.09c-0.479,-0.075 -0.969,-0.039 -1.399,0.09c-0.948,0.284 -1.571,0.999 -1.421,1.885c0.138,0.815 0.722,1.212 1.327,1.445c0.264,0.102 0.637,0.227 0.751,0.265c0.329,0.689 0.918,1.386 1.53,1.8Z"
          className="fill-[#e1d286]"
        />
        <path
          d="M21.807,22.561l-0.288,-0.053l-5.778,1.448l0.154,0.033c0.075,0.016 0.152,0.015 0.227,-0.004l5.685,-1.424Zm-0.682,-8.054c0.971,0.08 1.682,0.651 2.155,1.363c0.459,0.691 0.685,1.511 0.721,2.068c0.021,0.311 0.211,0.465 0.455,0.553c0.386,0.138 0.875,0.148 1.312,0.163c0.545,0.018 1.028,0.059 1.292,0.193c0.254,0.129 0.396,0.323 0.436,0.574c0.004,0.026 0.006,0.052 0.006,0.079c0,1.27 -0.018,3.501 -0.018,3.501c-0.001,0.147 -0.067,0.287 -0.181,0.381c-0.034,0.028 -0.072,0.052 -0.112,0.07l0.201,0.037c0.146,0.026 0.295,-0.013 0.409,-0.107c0.114,-0.094 0.18,-0.234 0.181,-0.381c0,-0 0.018,-2.231 0.018,-3.501c-0,-0.027 -0.002,-0.053 -0.006,-0.079c-0.041,-0.251 -0.183,-0.445 -0.437,-0.574c-0.263,-0.134 -0.746,-0.175 -1.291,-0.193c-0.437,-0.015 -0.926,-0.025 -1.312,-0.163c-0.244,-0.088 -0.435,-0.242 -0.455,-0.553c-0.037,-0.557 -0.262,-1.377 -0.721,-2.068c-0.489,-0.736 -1.232,-1.322 -2.255,-1.369c-0.141,-0.007 -0.274,-0.005 -0.398,0.006Zm-13.542,2.016c0.294,0.01 0.613,0.002 0.956,-0.025c0.967,-0.075 1.552,-0.316 1.944,-0.607c0.411,-0.305 0.622,-0.675 0.803,-1.038c0.115,-0.229 0.2,-0.461 0.406,-0.62c0.15,-0.116 0.359,-0.182 0.671,-0.201c-0.042,-0.001 -0.085,-0.002 -0.128,-0.003c-0.526,-0.019 -0.838,0.047 -1.041,0.204c-0.205,0.159 -0.291,0.391 -0.406,0.62c-0.181,0.363 -0.392,0.733 -0.803,1.038c-0.392,0.291 -0.977,0.532 -1.944,0.607c-0.158,0.013 -0.311,0.021 -0.458,0.025Zm13.995,-7.443c0.995,0.076 1.999,0.611 2.397,1.756c0.14,0.406 0.558,0.783 0.841,1.222c0.398,0.619 0.609,1.314 0.123,2.186c-0.219,0.391 -0.509,0.603 -0.825,0.694c-0.041,0.012 -0.083,0.022 -0.126,0.03c0.218,0.036 0.428,0.027 0.624,-0.03c0.316,-0.091 0.606,-0.303 0.825,-0.694c0.486,-0.872 0.275,-1.567 -0.124,-2.186c-0.282,-0.439 -0.7,-0.816 -0.841,-1.222c-0.464,-1.338 -1.756,-1.843 -2.894,-1.756Zm-12.837,-1.521c0.57,0.244 4.462,1.906 5.064,2.171c0.447,0.335 0.959,1.135 1.101,1.933c0.105,0.597 0.007,1.191 -0.388,1.641c-0.333,0.38 -0.908,0.68 -1.846,0.723c0.02,0 0.04,0.001 0.061,0.002c1.201,0.042 1.9,-0.289 2.283,-0.725c0.395,-0.45 0.493,-1.044 0.387,-1.641c-0.141,-0.798 -0.653,-1.598 -1.101,-1.933c-0.649,-0.286 -5.133,-2.201 -5.133,-2.201c-0.105,-0.037 -0.221,-0.039 -0.327,-0.003l-0.101,0.033Z"
          className="fill-[#fff7d0]"
        />
        <path d="M16.5,25.953l0,-16.953c-0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,0 -0.5,0.224 -0.5,0.5l0,16.953c-0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5Zm6,-1.953l0,-17.5c0,-0.276 -0.224,-0.5 -0.5,-0.5c-0.276,-0 -0.5,0.224 -0.5,0.5l0,17.5c0,0.276 0.224,0.5 0.5,0.5c0.276,-0 0.5,-0.224 0.5,-0.5Zm-13,-0.457l0,-17.089c-0,-0.251 -0.224,-0.454 -0.5,-0.454c-0.276,0 -0.5,0.203 -0.5,0.454l0,17.089c-0,0.251 0.224,0.454 0.5,0.454c0.276,-0 0.5,-0.203 0.5,-0.454Z" />
      </g>
    </svg>
  );
};

export default SideMain;
