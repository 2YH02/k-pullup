"use client";

import Section from "@common/section";
import Text from "@common/text";
import cn from "@lib/cn";
import LocationBadge from "@pages/home/location-badge";
import useScrollRefStore from "@store/useScrollRefStore";
import { useEffect, useRef, useState } from "react";

const COMPACT_ENTER_SCROLL_TOP = 36;
const COMPACT_EXIT_SCROLL_TOP = 12;

const HeroStickyHeader = () => {
  const { containerRef } = useScrollRefStore();
  const [isCompact, setIsCompact] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [offsetX, setOffsetX] = useState(0);

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

  // 뱃지를 가운데로 이동할 거리 계산
  useEffect(() => {
    const row = rowRef.current;
    const badge = badgeRef.current;
    if (!row || !badge) return;

    const rowWidth = row.offsetWidth;
    const badgeWidth = badge.offsetWidth;
    const badgeRight = row.offsetWidth - badge.offsetLeft - badgeWidth;
    // 가운데 위치: (rowWidth - badgeWidth) / 2
    // 현재 위치에서 가운데까지의 이동 거리 (왼쪽으로)
    const centerLeft = (rowWidth - badgeWidth) / 2;
    const currentLeft = row.offsetWidth - badgeRight - badgeWidth;
    setOffsetX(centerLeft - currentLeft);
  }, [isCompact]);

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
        ref={rowRef}
        className={cn(
          "flex items-center",
          isCompact ? "h-8" : "h-10",
          "transition-[height] duration-300 ease-out"
        )}
      >
        {/* 타이틀 — compact 시 페이드아웃 */}
        <div
          className={cn(
            "flex flex-col overflow-hidden whitespace-nowrap pr-3",
            "transition-[max-width,opacity,padding] duration-300 ease-out",
            isCompact ? "max-w-0 pr-0 opacity-0 pointer-events-none" : "max-w-[70%]"
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
          ref={badgeRef}
          className="ml-auto shrink-0 transition-transform duration-300 ease-out"
          style={{ transform: isCompact ? `translateX(${offsetX}px)` : "translateX(0)" }}
        >
          <LocationBadge />
        </div>
      </div>
    </Section>
  );
};

export default HeroStickyHeader;
