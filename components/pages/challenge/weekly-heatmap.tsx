"use client";

import { getHeatmapDates, getIntensityLevel } from "@lib/challenge-streak";
import useChallengeStore from "@store/useChallengeStore";
import { useMemo } from "react";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

const INTENSITY_CLASSES: Record<0 | 1 | 2 | 3, string> = {
  0: "bg-primary-subtle dark:bg-white/5",
  1: "bg-primary/20 dark:bg-primary-light/25",
  2: "bg-primary/45 dark:bg-primary-light/50",
  3: "bg-primary/75 dark:bg-primary-light/75",
};

/** 날짜 문자열을 "N월 N일" 형식으로 표시 */
const formatDisplayDate = (dateStr: string): string => {
  const [, month, day] = dateStr.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
};

interface WeeklyHeatmapProps {
  className?: string;
}

const WeeklyHeatmap = ({ className = "" }: WeeklyHeatmapProps) => {
  const data = useChallengeStore((s) => s.data);
  const selectedCell = useChallengeStore((s) => s.selectedCell);
  const selectCell = useChallengeStore((s) => s.selectCell);

  const today = useMemo(() => {
    const now = new Date();
    const year = String(now.getFullYear()).padStart(4, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const dates = useMemo(() => getHeatmapDates(today), [today]);

  const countMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const record of data.records) {
      map.set(record.date, record.count);
    }
    return map;
  }, [data.records]);

  return (
    <div
      className={`rounded-3xl border border-border bg-white p-5 dark:border-white/12 dark:bg-black-light ${className}`}
    >
      <h2 className="mb-3 text-sm font-semibold text-text-on-surface dark:text-white">
        방문 히트맵
      </h2>

      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 gap-[5px]">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-center text-[10px] font-medium text-text-on-surface-muted dark:text-grey-light"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Heatmap grid: 7 rows (weeks) × 7 columns (Mon-Sun) */}
      <div className="grid grid-cols-7 gap-[5px] touch-pan-y">
        {dates.map((date) => {
          const count = countMap.get(date) ?? 0;
          const level = getIntensityLevel(count);
          const isSelected = selectedCell?.date === date;

          return (
            <button
              key={date}
              type="button"
              className={`aspect-square w-full rounded-sm transition-transform active:scale-90 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:focus-visible:ring-primary-light/40 ${INTENSITY_CLASSES[level]} ${
                isSelected
                  ? "ring-2 ring-primary/60 dark:ring-primary-light/60"
                  : ""
              }`}
              aria-label={`${formatDisplayDate(date)}, 방문 ${count}회`}
              onClick={() => selectCell({ date, count })}
            />
          );
        })}
      </div>

      {/* Selected cell info */}
      {selectedCell && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-primary-subtle px-3 py-2 dark:border-white/12 dark:bg-white/5">
          <span className="text-xs font-medium text-text-on-surface dark:text-white">
            {formatDisplayDate(selectedCell.date)}
          </span>
          <span className="text-xs text-text-on-surface-muted dark:text-grey-light">
            {selectedCell.count > 0
              ? `${selectedCell.count}회 방문`
              : "방문 기록 없음"}
          </span>
        </div>
      )}
    </div>
  );
};

export default WeeklyHeatmap;
