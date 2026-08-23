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
          "flex items-center overflow-hidden",
          "web:justify-center",
          isCompact ? "justify-center h-8" : "mo:justify-between h-10",
          "max-[384px]:justify-center",
          "transition-[height] duration-200 ease-out"
        )}
      >
        <div
          className={cn(
            "flex flex-col grow overflow-hidden origin-left max-w-[68%] pr-3 web:max-w-90 web:pr-4",
            "transition-[max-width,opacity,transform,padding] duration-250 ease-out",
            isCompact && "grow-0 max-w-0 pr-0 opacity-0 -translate-y-0.5 pointer-events-none"
          )}
        >
          <Text fontWeight="bold" typography="t5" className="text-text-on-surface whitespace-nowrap">
            대한민국 철봉 지도
          </Text>
          <Text typography="t6" className="text-text-on-surface-muted whitespace-nowrap max-[370px]:hidden">
            내 주변에서 바로 시작
          </Text>
        </div>

        <div
          className={cn(
            "shrink-0",
            "transition-transform duration-250 ease-out",
            isCompact && "mx-auto",
            "max-[370px]:mx-auto"
          )}
        >
          <LocationBadge />
        </div>
      </div>
    </Section>
  );
};

export default HeroStickyHeader;
