"use client";

import { type Device } from "@/app/mypage/page";
import Section from "@common/section";
import SearchIcon from "@icons/search-icon";
import cn from "@lib/cn";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchInput = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const router = useRouter();
  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";
  const style = isMobileApp ? "mo:top-12" : "";
  const [isNavigating, setIsNavigating] = useState(false);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (!navigateTimeoutRef.current) return;
      clearTimeout(navigateTimeoutRef.current);
    };
  }, []);

  const handleMoveSearchPage = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    navigateTimeoutRef.current = setTimeout(() => {
      router.push("/search?from=home");
    }, 130);
  };

  return (
    <Section
      className={cn(
        "mo:bg-transparent mo:dark:bg-transparent mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0",
        style
      )}
    >
      <button
        type="button"
        onClick={handleMoveSearchPage}
        aria-label="검색 페이지로 이동"
        className={cn(
          "w-full flex items-center gap-4",
          "h-12",
          "rounded-2xl px-5",
          "bg-search-input-bg dark:bg-black/35",
          "border border-white/70 dark:border-white/10",
          "shadow-[0_1px_2px_rgba(64,64,56,0.08)]",
          "backdrop-blur-[2px]",
          "transition-transform duration-180 ease-out motion-reduce:transition-none",
          "active:scale-[0.99] focus-visible:scale-[0.995]",
          isNavigating ? "scale-[1.015] opacity-95" : "scale-100 opacity-100"
        )}
      >
        <SearchIcon
          size={24}
          className="fill-location-badge-text dark:fill-location-badge-text-dark"
        />
        <span className="text-left text-text-on-surface-muted/70 dark:text-grey-light/70">
          철봉 주소 검색...
        </span>
      </button>
    </Section>
  );
};

export default SearchInput;
