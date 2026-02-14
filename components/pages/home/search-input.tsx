"use client";

import { type Device } from "@/app/mypage/page";
import Section from "@common/section";
import SearchIcon from "@icons/search-icon";
import cn from "@lib/cn";
import { useRouter } from "next/navigation";

const SearchInput = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const router = useRouter();
  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";
  const style = isMobileApp ? "mo:top-12" : "";

  return (
    <Section
      className={cn(
        "mo:bg-transparent mo:dark:bg-transparent mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0",
        style
      )}
    >
      <button
        type="button"
        onClick={() => router.push("/search")}
        aria-label="검색 페이지로 이동"
        className={cn(
          "w-full flex items-center gap-4",
          "h-12",
          "rounded-2xl px-5",
          "bg-search-input-bg dark:bg-black/35",
          "border border-white/70 dark:border-white/10",
          "shadow-[0_1px_2px_rgba(64,64,56,0.08)]",
          "backdrop-blur-[2px]"
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
