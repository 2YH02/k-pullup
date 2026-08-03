"use client";

import { useEffect } from "react";

import Section from "@/components/common/section";
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
    <div>
      <Section>
        <CelebrationMotion />
      </Section>

      <Section>
        <StreakCounter />
      </Section>

      <Section>
        <WeeklyHeatmap />
      </Section>

      <Section>
        <GoalCard />
      </Section>
    </div>
  );
};

export default ChallengeClient;
