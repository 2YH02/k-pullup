"use client";

import { useEffect, useRef, useState } from "react";

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

  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);
  const reducedMotion = useRef(false);
  const markedRef = useRef(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const today = getToday();
    const weeklyCount = getWeeklyAchievedCount(records, today);
    const goalAchieved = weeklyCount >= goalSettings.weeklyGoal;
    const currentWeek = getWeekIdentifier(today);
    const alreadyShown = goalSettings.celebrationShownWeek === currentWeek;

    if (goalAchieved && !alreadyShown && !markedRef.current) {
      setVisible(true);
      markedRef.current = true;
      markCelebrationShown();

      // Trigger animation on next frame (for reduced-motion, just show static)
      if (!reducedMotion.current) {
        requestAnimationFrame(() => {
          setAnimated(true);
        });
      }
    }
  }, [records, goalSettings, markCelebrationShown]);

  if (!visible) return null;

  // prefers-reduced-motion: static message only
  if (reducedMotion.current) {
    return (
      <div className="rounded-3xl border border-primary/14 bg-primary/8 p-5 dark:border-white/12 dark:bg-primary-light/10">
        <div className="flex items-center gap-3">
          <PartyPopper
            size={22}
            className="text-primary dark:text-primary-light"
          />
          <p className="text-sm font-semibold text-primary dark:text-primary-light">
            🎉 목표 달성!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-3xl border border-primary/14 bg-primary/8 p-5 dark:border-white/12 dark:bg-primary-light/10"
      style={{
        transform: animated ? "scale(1)" : "scale(0.8)",
        opacity: animated ? 1 : 0,
        transition: "transform 200ms ease-out, opacity 200ms ease-out",
      }}
    >
      <div className="flex items-center gap-3">
        <PartyPopper
          size={22}
          className="text-primary dark:text-primary-light"
        />
        <p className="text-sm font-semibold text-primary dark:text-primary-light">
          이번 주 목표 달성! 🎉
        </p>
      </div>
    </div>
  );
};

export default CelebrationMotion;
