"use client";

import { getWeeklyAchievedCount } from "@lib/challenge-streak";
import useChallengeStore from "@store/useChallengeStore";
import { Target } from "lucide-react";

interface GoalCardProps {
  className?: string;
}

const GoalCard = ({ className = "" }: GoalCardProps) => {
  const weeklyGoal = useChallengeStore((s) => s.data.goalSettings.weeklyGoal);
  const records = useChallengeStore((s) => s.data.records);
  const setWeeklyGoal = useChallengeStore((s) => s.setWeeklyGoal);

  const today = getToday();
  const achieved = getWeeklyAchievedCount(records, today);
  const progressPercent = Math.min((achieved / weeklyGoal) * 100, 100);

  return (
    <div
      className={`rounded-3xl border border-primary/14 bg-side-main p-5 dark:border-white/12 dark:bg-black/30 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/14 bg-primary/6">
          <Target
            size={18}
            className="text-primary dark:text-primary-light"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-text-on-surface dark:text-white">
            이번 주 목표
          </p>
          <p className="text-xs text-text-on-surface-muted dark:text-grey-light">
            {achieved}일 / {weeklyGoal}일 달성
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 dark:bg-primary-light"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs text-text-on-surface-muted dark:text-grey-light">
          {Math.round(progressPercent)}%
        </p>
      </div>

      {/* Goal selector */}
      <div>
        <p className="mb-2 text-xs text-text-on-surface-muted dark:text-grey-light">
          주간 목표 변경
        </p>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setWeeklyGoal(day)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors duration-150 ${
                day === weeklyGoal
                  ? "bg-primary text-white dark:bg-primary-light dark:text-black"
                  : "bg-primary/8 text-text-on-surface-muted hover:bg-primary/16 active:scale-95 dark:bg-white/8 dark:text-grey-light dark:hover:bg-white/16"
              }`}
              aria-label={`주간 목표 ${day}일로 변경`}
              aria-pressed={day === weeklyGoal}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/** 오늘 날짜를 YYYY-MM-DD 형식으로 반환 */
const getToday = (): string => {
  const now = new Date();
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default GoalCard;
