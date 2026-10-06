"use client";

import { useEffect } from "react";

import useChallengeStore from "@store/useChallengeStore";

import CelebrationMotion from "./celebration-motion";
import GoalCard from "./goal-card";
import StreakCounter from "./streak-counter";
import WeeklyHeatmap from "./weekly-heatmap";

const ChallengeClient = () => {
  const hydrate = useChallengeStore((s) => s.hydrate);
  const recordVisit = useChallengeStore((s) => s.recordVisit);

  // mount-only: localStorage hydration + today's visit recording
  useEffect(() => {
    hydrate();
    recordVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Zustand actions are stable, only run on mount
  }, []);

  return (
    <div className="space-y-3 px-6 pb-8 pt-5">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] text-primary dark:text-primary-light">
          이번 주 운동
        </p>
        <h1 className="mt-1 text-lg font-extrabold tracking-tight text-text-on-surface dark:text-grey-light">
          꾸준함을 기록해보세요
        </h1>
        <p className="mt-1 text-[12px] text-text-on-surface-muted dark:text-grey">
          작은 방문이 다음 운동을 이어주는 힘이 됩니다.
        </p>
      </div>

      <CelebrationMotion />
      <GoalCard />
      <StreakCounter />
      <WeeklyHeatmap />
    </div>
  );
};

export default ChallengeClient;
