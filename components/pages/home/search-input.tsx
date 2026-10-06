"use client";

import type { Device } from "@/types/device";
import Section from "@common/section";
import SearchIcon from "@icons/search-icon";
import cn from "@lib/cn";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchInput = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const router = useRouter();
  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";
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
        "pb-3 pt-5 web:pb-4 web:pt-6",
        isMobileApp && "pt-4"
      )}
    >
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] text-primary dark:text-primary-light">
            철봉 찾기
          </p>
          <p className="mt-1 text-lg font-extrabold tracking-tight text-text-on-surface dark:text-grey-light">
            어디서 찾을까요?
          </p>
        </div>
        <span className="pb-0.5 text-right text-[11px] leading-relaxed text-text-on-surface-muted dark:text-grey">
          주소·공원명으로<br />검색
        </span>
      </div>
      <button
        type="button"
        onClick={handleMoveSearchPage}
        aria-label="검색 페이지로 이동"
        className={cn(
          "w-full flex items-center gap-3.5",
          "min-h-14",
          "rounded-2xl px-4.5 py-3",
          "bg-search-input-bg/80 dark:bg-black/35",
          "border border-white/80 dark:border-white/10",
          "shadow-[0_6px_18px_rgba(64,64,56,0.07)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.2)]",
          "backdrop-blur-[3px]",
          "group",
          "transition-transform duration-180 ease-out motion-reduce:transition-none",
          "active:scale-[0.99] focus-visible:scale-[0.995]",
          isNavigating ? "scale-[1.015] opacity-95" : "scale-100 opacity-100"
        )}
      >
        <SearchIcon
          size={21}
          className="shrink-0 fill-location-badge-text dark:fill-location-badge-text-dark"
        />
        <span className="min-w-0 flex-1 truncate text-left text-sm text-text-on-surface-muted/80 dark:text-grey-light/70">
          주소·공원명으로 철봉 검색
        </span>
        <ArrowRight
          size={18}
          className="shrink-0 text-text-on-surface-muted/65 transition-transform duration-180 group-hover:translate-x-0.5 dark:text-grey/70"
        />
      </button>
    </Section>
  );
};

export default SearchInput;
