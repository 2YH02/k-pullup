"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getWeekIdentifier, getWeeklyAchievedCount } from "@lib/challenge-streak";
import useChallengeStore from "@store/useChallengeStore";
import { PartyPopper } from "lucide-react";

const getToday = (): string => {
  const now = new Date();
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const CelebrationMotion = () => {
  const records = useChallengeStore((s) => s.data.records);
  const goalSettings = useChallengeStore((s) => s.data.goalSettings);
  const markCelebrationShown = useChallengeStore((s) => s.markCelebrationShown);

  const [showEntryAnimation, setShowEntryAnimation] = useState(false);
  const markedRef = useRef(false);

  const today = useMemo(() => getToday(), []);
  const currentWeek = useMemo(() => getWeekIdentifier(today), [today]);
  const weeklyCount = useMemo(
    () => getWeeklyAchievedCount(records, today),
    [records, today]
  );

  const goalAchieved = weeklyCount >= goalSettings.weeklyGoal;
  const alreadyShown = goalSettings.celebrationShownWeek === currentWeek;

  // 목표 달성 + 아직 이번 주에 표시 안 했을 때 → 첫 진입 애니메이션 + mark
  useEffect(() => {
    if (goalAchieved && !alreadyShown && !markedRef.current) {
      markedRef.current = true;
      markCelebrationShown();
      setShowEntryAnimation(true);
    }
  }, [goalAchieved, alreadyShown, markCelebrationShown]);

  // 목표 미달성이면 안 보임
  if (!goalAchieved && !alreadyShown) return null;
  // 달성했거나 이미 이번 주에 mark된 상태면 계속 보임
  if (!goalAchieved && alreadyShown) {
    // 이번 주에 mark는 됐지만 현재 시점에 달성 안 된 경우 (목표를 올린 경우)
    return null;
  }

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-primary-subtle px-4 py-3.5 dark:border-grey-dark dark:bg-black-light ${
        showEntryAnimation && !reducedMotion
          ? "animate-[fade-in_300ms_ease-out]"
          : ""
      }`}
    >
      {/* 배경 장식 제거 — 미니멀 유지 */}

      <div className="relative flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 dark:bg-primary-light/15">
          <PartyPopper
            size={18}
            className="text-primary dark:text-primary-light"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-on-surface dark:text-white">
            이번 주 목표 달성! 🎉
          </p>
          <p className="text-xs text-text-on-surface-muted dark:text-grey-light">
            {weeklyCount}일 / {goalSettings.weeklyGoal}일 완료
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelebrationMotion;
