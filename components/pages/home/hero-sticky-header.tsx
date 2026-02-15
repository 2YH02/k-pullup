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
        "web:py-4 mo:py-2",
        "sticky top-6 z-20",
        "backdrop-blur-sm bg-surface/92 dark:bg-black/55",
        "web:transition-[background-color,backdrop-filter] web:duration-300 web:ease-out mo:transition-[background-color,backdrop-filter] mo:duration-300 mo:ease-out"
      )}
    >
      <div
        className={cn(
          "flex h-10 items-center overflow-hidden",
          "web:justify-center",
          isCompact ? "mo:justify-center" : "mo:justify-between",
          "max-[384px]:justify-center"
        )}
      >
        <div
          className={cn(
            "flex flex-col grow overflow-hidden web:origin-left web:max-w-90 web:pr-4 mo:origin-left mo:max-w-[68%] mo:pr-3",
            "web:transition-[max-width,opacity,transform,padding] web:duration-250 web:ease-out mo:transition-[max-width,opacity,transform,padding] mo:duration-250 mo:ease-out",
            isCompact && "web:grow-0 web:max-w-0 web:pr-0 web:opacity-0 web:-translate-y-0.5 web:pointer-events-none mo:grow-0 mo:max-w-0 mo:pr-0 mo:opacity-0 mo:-translate-y-0.5 mo:pointer-events-none"
          )}
        >
          <Text fontWeight="bold" typography="t5" className="text-text-on-surface whitespace-nowrap">
            가까운 철봉 찾기
          </Text>
          <Text typography="t6" className="text-text-on-surface-muted whitespace-nowrap max-[370px]:hidden">
            내 주변에서 바로 시작
          </Text>
        </div>

        <div
          className={cn(
            "shrink-0",
            "web:transition-transform web:duration-250 web:ease-out mo:transition-transform mo:duration-250 mo:ease-out",
            isCompact && "mo:mx-auto web:mx-auto",
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
