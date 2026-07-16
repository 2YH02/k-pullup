import { create } from "zustand";

import type { ChallengeData } from "@lib/challenge-storage";
import {
  getDefaultData,
  loadChallengeData,
  saveChallengeData,
} from "@lib/challenge-storage";
import { calculateStreak, getWeekIdentifier } from "@lib/challenge-streak";

interface ChallengeState {
  // State
  data: ChallengeData;
  isHydrated: boolean;
  selectedCell: { date: string; count: number } | null;

  // Actions
  hydrate: () => void;
  recordVisit: (date?: string) => void;
  setWeeklyGoal: (goal: number) => void;
  selectCell: (cell: { date: string; count: number } | null) => void;
  markCelebrationShown: () => void;
}

const getToday = (): string => {
  const now = new Date();
  const year = String(now.getFullYear()).padStart(4, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const useChallengeStore = create<ChallengeState>()((set, get) => ({
  data: getDefaultData(),
  isHydrated: false,
  selectedCell: null,

  hydrate: () => {
    const loaded = loadChallengeData();
    const data = loaded ?? getDefaultData();
    set({ data, isHydrated: true });
  },

  recordVisit: (date?: string) => {
    const today = date ?? getToday();
    const { data } = get();

    const existingIndex = data.records.findIndex((r) => r.date === today);
    let updatedRecords;

    if (existingIndex >= 0) {
      updatedRecords = data.records.map((r, i) =>
        i === existingIndex ? { ...r, count: r.count + 1 } : r
      );
    } else {
      updatedRecords = [...data.records, { date: today, count: 1 }];
    }

    const currentStreak = calculateStreak(updatedRecords, today);
    const maxStreak = Math.max(data.streakData.max, currentStreak);

    const updatedData: ChallengeData = {
      ...data,
      records: updatedRecords,
      streakData: { current: currentStreak, max: maxStreak },
    };

    set({ data: updatedData });
    saveChallengeData(updatedData);
  },

  setWeeklyGoal: (goal: number) => {
    const clamped = Math.max(1, Math.min(7, Math.round(goal)));
    const { data } = get();

    const updatedData: ChallengeData = {
      ...data,
      goalSettings: { ...data.goalSettings, weeklyGoal: clamped },
    };

    set({ data: updatedData });
    saveChallengeData(updatedData);
  },

  selectCell: (cell: { date: string; count: number } | null) => {
    set({ selectedCell: cell });
  },

  markCelebrationShown: () => {
    const today = getToday();
    const weekId = getWeekIdentifier(today);
    const { data } = get();

    const updatedData: ChallengeData = {
      ...data,
      goalSettings: { ...data.goalSettings, celebrationShownWeek: weekId },
    };

    set({ data: updatedData });
    saveChallengeData(updatedData);
  },
}));

export default useChallengeStore;
