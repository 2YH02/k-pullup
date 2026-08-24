"use client";

import useChallengeStore from "@store/useChallengeStore";
import { Flame, Trophy } from "lucide-react";

interface StreakCounterProps {
  className?: string;
}

const StreakCounter = ({ className = "" }: StreakCounterProps) => {
  const streakData = useChallengeStore((s) => s.data.streakData);

  return (
    <div
      className={`rounded-3xl border border-border bg-white p-5 dark:border-white/12 dark:bg-black-light ${className}`}
    >
      <div className="flex items-center">
        {/* Current streak */}
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-primary-subtle">
            <Flame size={22} className="text-primary dark:text-primary-light" />
          </div>
          <div>
            <p className="text-3xl font-bold leading-tight text-text-on-surface dark:text-white">
              {streakData.current}
              <span className="ml-1 text-sm font-medium text-text-on-surface-muted dark:text-grey-light">
                일
              </span>
            </p>
            <p className="text-xs text-text-on-surface-muted dark:text-grey-light">
              연속 방문
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-10 w-px shrink-0 bg-primary/14 dark:bg-white/12" />

        {/* Max streak */}
        <div className="flex flex-1 items-center justify-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-primary-subtle">
            <Trophy
              size={16}
              className="text-primary-light dark:text-grey-light"
            />
          </div>
          <div>
            <p className="text-lg font-semibold leading-tight text-text-on-surface dark:text-white">
              {streakData.max}
              <span className="ml-0.5 text-xs font-medium text-text-on-surface-muted dark:text-grey-light">
                일
              </span>
            </p>
            <p className="text-xs text-text-on-surface-muted dark:text-grey-light">
              최대 기록
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;
