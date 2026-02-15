"use client";

import CloseIcon from "@/components/icons/close-icon";
import Input from "@common/input";
import ArrowLeftIcon from "@icons/arrow-left-icon";
import HomeIcon from "@icons/home-icon";
import cn from "@lib/cn";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchHeaderProps {
  value: string;
  isInternal?: boolean;
  isEntryFromHome?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFn: VoidFunction;
  onEnter?: VoidFunction;
}

const SearchHeader = ({
  value,
  isInternal,
  isEntryFromHome = false,
  onChange,
  clearFn,
  onEnter,
}: SearchHeaderProps) => {
  const router = useRouter();
  const [isHeaderReady, setIsHeaderReady] = useState(!isEntryFromHome);

  useEffect(() => {
    if (!isEntryFromHome) return;

    const frame = requestAnimationFrame(() => {
      setIsHeaderReady(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isEntryFromHome]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="mo:fixed sticky top-0 left-0 flex items-center justify-center w-full h-14 bg-white/45 dark:bg-black/45 backdrop-blur-[2px] py-3">
      <button
        className="px-3"
        onClick={() => (isInternal ? router.back() : router.push("/"))}
      >
        {isInternal ? (
          <ArrowLeftIcon className="fill-black dark:fill-white" />
        ) : (
          <HomeIcon className="fill-black dark:fill-white" />
        )}
      </button>
      <div
        className={cn(
          "grow pr-4 transition-all duration-180 ease-out motion-reduce:transition-none",
          isHeaderReady
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-1 scale-[0.98] opacity-60"
        )}
      >
        <Input
          isInvalid={false}
          className={cn(
            "rounded-xl border-white/70 dark:border-white/10",
            "bg-search-input-bg dark:bg-black/35",
            "shadow-[0_1px_2px_rgba(64,64,56,0.08)]"
          )}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="철봉 위치 주소로 검색"
          isFocus
          icon={<CloseIcon size={20} />}
          onIconClick={clearFn}
        />
      </div>
    </div>
  );
};

export default SearchHeader;
