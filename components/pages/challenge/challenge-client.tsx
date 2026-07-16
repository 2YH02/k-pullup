"use client";

import { useEffect } from "react";

import useChallengeStore from "@store/useChallengeStore";

import CelebrationMotion from "./celebration-motion";
import GoalCard from "./goal-card";
import StreakCounter from "./streak-counter";
import WeeklyHeatmap from "./weekly-heatmap";

const ChallengeClient = () => {
  const isHydrated = useChallengeStore((s) => s.isHydrated);
  const hydrate = useChallengeStore((s) => s.hydrate);
  const recordVisit = useChallengeStore((s) => s.recordVisit);

  // mount-only: localStorage hydration + today's visit recording
  useEffect(() => {
    hydrate();
    recordVisit();
  }, [hydrate, recordVisit]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        {/* Skeleton: CelebrationMotion area */}
        <div className="h-16 animate-pulse rounded-3xl bg-primary/10 dark:bg-white/10" />
        {/* Skeleton: StreakCounter area */}
        <div className="h-24 animate-pulse rounded-3xl bg-primary/10 dark:bg-white/10" />
        {/* Skeleton: WeeklyHeatmap area */}
        <div className="h-56 animate-pulse rounded-3xl bg-primary/10 dark:bg-white/10" />
        {/* Skeleton: GoalCard area */}
        <div className="h-44 animate-pulse rounded-3xl bg-primary/10 dark:bg-white/10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <CelebrationMotion />
      <StreakCounter />
      <WeeklyHeatmap />
      <GoalCard />
    </div>
  );
};

export default ChallengeClient;
