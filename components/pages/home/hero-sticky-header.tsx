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
        "web:pb-0",
        "mo:sticky mo:top-0 mo:z-20",
        "mo:backdrop-blur-sm mo:bg-[rgb(243_237_229/0.92)] mo:dark:bg-[rgb(0_0_0/0.55)]",
        "mo:transition-[background-color,backdrop-filter] mo:duration-300 mo:ease-out"
      )}
    >
      <div
        className={cn(
          "flex items-center mo:min-h-10",
          "web:justify-center",
          "mo:transition-all mo:duration-300 mo:ease-out",
          isCompact ? "mo:justify-center" : "mo:justify-between"
        )}
      >
        <div
          className={cn(
            "flex flex-col grow overflow-hidden mo:origin-left",
            "mo:transition-all mo:duration-300 mo:ease-out",
            isCompact && "mo:grow-0 mo:max-w-0 mo:max-h-0 mo:opacity-0 mo:-translate-y-1 mo:pointer-events-none"
          )}
        >
          <Text fontWeight="bold" typography="t5" className="text-text-on-surface">
            Find your rhythm
          </Text>
          <Text typography="t6" className="text-text-on-surface-muted">
            Start your routine nearby.
          </Text>
        </div>

        <div
          className={cn(
            "shrink-0",
            "mo:transition-all mo:duration-300 mo:ease-out",
            isCompact && "mo:mx-auto"
          )}
        >
          <LocationBadge />
        </div>
      </div>
    </Section>
  );
};

export default HeroStickyHeader;
