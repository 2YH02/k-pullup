"use client";

import Section from "@common/section";
import Text from "@common/text";
import cn from "@lib/cn";
import LocationBadge from "@pages/home/location-badge";
import useScrollRefStore from "@store/useScrollRefStore";
import { useEffect, useState } from "react";

const COMPACT_ENTER_SCROLL_TOP = 36;
const COMPACT_EXIT_SCROLL_TOP = 12;

const HeroStickyHeader = () => {
  const { containerRef } = useScrollRefStore();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setIsCompact((prev) => {
        if (!prev && scrollTop > COMPACT_ENTER_SCROLL_TOP) return true;
        if (prev && scrollTop < COMPACT_EXIT_SCROLL_TOP) return false;
        return prev;
      });
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);

  return (
    <Section
      className={cn(
        "web:py-3 mo:py-2 pb-1",
        "sticky top-6 web:top-0 z-20",
        "backdrop-blur-sm bg-surface/92 dark:bg-black/55",
        "transition-[background-color,backdrop-filter] duration-300 ease-out"
      )}
    >
      <div
        className={cn(
          "relative flex items-center overflow-hidden",
          isCompact ? "h-8" : "h-10",
          "transition-[height] duration-250 ease-out"
        )}
      >
        {/* 타이틀 — compact 시 페이드아웃 */}
        <div
          className={cn(
            "flex flex-col min-w-0 flex-1 pr-3 web:pr-4",
            "transition-[opacity,transform] duration-250 ease-out",
            isCompact && "opacity-0 -translate-y-1 pointer-events-none"
          )}
        >
          <Text fontWeight="bold" typography="t5" className="text-text-on-surface whitespace-nowrap">
            대한민국 철봉 지도
          </Text>
          <Text typography="t6" className="text-text-on-surface-muted whitespace-nowrap max-[370px]:hidden">
            내 주변에서 바로 시작
          </Text>
        </div>

        {/* 위치 뱃지 — compact 시 가운데로 슬라이드 */}
        <div
          className={cn(
            "absolute shrink-0 top-1/2 -translate-y-1/2",
            "transition-[left,transform] duration-300 ease-out",
            isCompact
              ? "left-1/2 -translate-x-1/2"
              : "left-[calc(100%-0px)] -translate-x-full"
          )}
        >
          <LocationBadge />
        </div>
      </div>
    </Section>
  );
};

export default HeroStickyHeader;
