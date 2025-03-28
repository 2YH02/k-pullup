"use client";

import Skeleton from "@components/common/skeleton";
import PinIcon from "@components/icons/pin-icon";
import areaRanking from "@lib/api/marker/area-ranking";
import { type RankingInfo } from "@lib/api/marker/marker-ranking";
import cn from "@lib/cn";
import useGeolocationStore from "@store/useGeolocationStore";
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
      <div className="flex gap-2 text-sm text-grey-dark dark:text-grey mb-2">
        <button
          className={cn("underline", rankingType === "all" && "text-primary")}
          onClick={() => setRankingType("all")}
        >
          전체
        </button>
        <button
          className={cn(
            "underline",
            rankingType === "around" && "text-primary"
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
      <div>
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <div>랭킹에 등록되어 있는 철봉이 없습니다.</div>
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
    <div>
      {data.slice(0, visibleCount).map((item, index) => {
        return (
          <button
            key={item.markerId}
            className="flex items-center p-2 text-left active:bg-grey-light dark:active:bg-grey-dark w-full rounded-md"
            onClick={() => router.push(`/pullup/${item.markerId}`)}
          >
            <div className="shrink-0 font-bold mr-2 w-7">{index + 1}</div>
            <div className="grow text-sm">{item.address}</div>
            <div className="shrink-0">
              <PinIcon />
            </div>
          </button>
        );
      })}
      <div className="flex justify-center gap-3">
        {hasMore && (
          <button
            onClick={loadMore}
            className="underline text-sm text-grey-dark dark:text-grey"
          >
            더보기
          </button>
        )}
        {visibleCount > 10 && (
          <button
            onClick={resetList}
            className="underline text-sm text-grey-dark dark:text-grey"
          >
            접기
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkerRankingList;
