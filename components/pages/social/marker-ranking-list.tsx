"use client";

import Skeleton from "@components/common/skeleton";
import PinIcon from "@components/icons/pin-icon";
import areaRanking from "@lib/api/marker/area-ranking";
import { type RankingInfo } from "@lib/api/marker/marker-ranking";
import cn from "@lib/cn";
import useGeolocationStore from "@store/useGeolocationStore";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MarkerRankingList = ({ allRanking }: { allRanking: RankingInfo[] }) => {
  const { myLocation } = useGeolocationStore();

  const [rankingType, setRankingType] = useState<"all" | "around">("all");

  const [aroundRanking, setAroundMarker] = useState<RankingInfo[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!myLocation || rankingType === "all") return;
    const fetchData = async () => {
      setLoading(true);
      const data = await areaRanking(myLocation.lat, myLocation.lng);

      setAroundMarker(data);
      setLoading(false);
    };
    fetchData();
  }, [myLocation, rankingType]);

  return (
    <div>
      {/* 랭킹 타입 버튼 */}
      <div className="mb-3 inline-flex rounded-full border border-primary/12 bg-side-main p-1 text-sm dark:border-white/10">
        <button
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            rankingType === "all"
              ? "bg-primary/12 text-primary dark:text-primary-light"
              : "text-text-on-surface-muted dark:text-grey-light"
          )}
          onClick={() => setRankingType("all")}
        >
          전체
        </button>
        <button
          className={cn(
            "rounded-full px-3 py-1 transition-colors",
            rankingType === "around"
              ? "bg-primary/12 text-primary dark:text-primary-light"
              : "text-text-on-surface-muted dark:text-grey-light"
          )}
          onClick={() => setRankingType("around")}
        >
          내 주변
        </button>
      </div>

      {/* 모든 랭킹 */}
      {rankingType === "all" && <List data={allRanking} isLoading={false} />}

      {rankingType === "around" && (
        <List data={aroundRanking} isLoading={loading} />
      )}
    </div>
  );
};

const List = ({
  data,
  isLoading,
}: {
  data?: RankingInfo[] | null;
  isLoading: boolean;
}) => {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(10);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-primary/12 bg-side-main p-4 dark:border-white/10">
        <div className="text-text-on-surface dark:text-white">
          랭킹에 등록되어 있는 철봉이 없습니다.
        </div>
      </div>
    );
  }

  const hasMore = visibleCount < data.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, data.length));
  };

  const resetList = () => {
    setVisibleCount(10);
  };

  return (
    <div className="space-y-1.5">
      {data.slice(0, visibleCount).map((item, index) => {
        const rank = index + 1;
        const isTopThree = rank <= 3;

        return (
          <button
            key={item.markerId}
            className={cn(
              "group flex w-full items-center text-left transition-all",
              isTopThree
                ? "rounded-xl border px-3 py-2.5"
                : "rounded-lg px-2.5 py-2",
              isTopThree && rank === 1 && "border-yellow/60 bg-yellow/15",
              isTopThree && rank === 2 && "border-grey/45 bg-grey-light/65 dark:bg-grey-dark/24",
              isTopThree && rank === 3 && "border-coral/40 bg-coral/14",
              !isTopThree && "border border-primary/12 bg-side-main",
              "active:scale-[0.985] active:bg-grey-light dark:active:bg-grey-dark",
              "web:hover:border-primary/28 web:hover:bg-white/50 dark:web:hover:bg-black/30"
            )}
            onClick={() => router.push(`/pullup/${item.markerId}`)}
            type="button"
          >
            <div
              className={cn(
                "mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                rank === 1 && "bg-yellow/85 text-black",
                rank === 2 && "bg-grey text-white",
                rank === 3 && "bg-coral text-white",
                rank > 3 && "bg-primary/12 text-text-on-surface"
              )}
            >
              {rank}
            </div>
            {rank === 1 && (
              <div className="mr-2 shrink-0 rounded-md bg-white/75 p-0.5 ring-1 ring-yellow/40 dark:bg-black/35">
                <Crown
                  size={14}
                  className="text-yellow transition-transform duration-200 web:group-hover:-translate-y-0.5 web:group-hover:scale-110 group-active:scale-95 group-focus-visible:scale-105"
                />
              </div>
            )}
            <div className="grow text-sm text-text-on-surface dark:text-white">
              {item.address}
            </div>
            <div className="ml-2 shrink-0 opacity-95">
              <PinIcon
                size={22}
                className="text-location-badge-text dark:text-location-badge-text-dark"
              />
            </div>
          </button>
        );
      })}
      <div className="flex justify-center gap-3 pt-1">
        {visibleCount > 10 && (
          <button
            onClick={resetList}
            className="rounded-full border border-primary/15 px-3 py-1 text-sm text-text-on-surface-muted transition-colors web:hover:bg-primary/8 dark:text-grey-light"
          >
            접기
          </button>
        )}
        {hasMore && (
          <button
            onClick={loadMore}
            className="rounded-full border border-primary/15 px-3 py-1 text-sm text-text-on-surface-muted transition-colors web:hover:bg-primary/8 dark:text-grey-light"
          >
            더보기
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkerRankingList;
