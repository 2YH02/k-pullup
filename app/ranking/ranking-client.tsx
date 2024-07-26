"use client";

import type { RankingInfo } from "@api/marker/marker-ranking";
import Badge from "@common/badge";
import CheckedIcon from "@icons/checked-icon";
import AreaRankingList from "@pages/ranking/area-ranking-list";
import RankingList from "@pages/ranking/ranking-list";
import { useState } from "react";

interface RankingClientProps {
  data: RankingInfo[];
}

const RankingClient = ({ data }: RankingClientProps) => {
  const [ranking, setRanking] = useState<"all" | "area">("all");

  return (
    <>
      <div className="bg-[url('/ranking.webp')] h-40 bg-center bg-50%">
        <div className="w-full h-full flex flex-col justify-center items-center bg-[rgba(0,0,0,0.4)]">
          <div className="text-white text-lg font-bold mb-3">
            많이 찾는 철봉 위치
          </div>
          <div className="flex items-center justify-center">
            <Badge
              text="전체"
              className="bg-white mx-2 w-20"
              textStyle={
                ranking === "area"
                  ? "text-grey dark:text-grey-dark"
                  : "dark:text-black"
              }
              icon={
                ranking === "all" && (
                  <CheckedIcon size={20} className="dark:fill-grey-dark" />
                )
              }
              isButton
              onClick={() => setRanking("all")}
            />
            <Badge
              text="주변"
              className="bg-white mx-2 w-20"
              textStyle={
                ranking === "all"
                  ? "text-grey dark:text-grey-dark"
                  : "dark:text-black"
              }
              icon={
                ranking === "area" && (
                  <CheckedIcon size={20} className="dark:fill-black" />
                )
              }
              isButton
              onClick={() => setRanking("area")}
            />
          </div>
        </div>
        <div>
          {ranking === "all" ? (
            <RankingList data={data} />
          ) : (
            <AreaRankingList />
          )}
        </div>
      </div>
    </>
  );
};

export default RankingClient;
