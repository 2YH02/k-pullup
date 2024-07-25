"use client";

import Badge from "@common/badge";
import CheckedIcon from "@icons/checked-icon";
import RankingItem from "@pages/ranking/ranking-item";

const RankingClient = () => {
  const data = Array(10).fill(0);
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
              icon={<CheckedIcon size={20} />}
            />
            <Badge
              text="주변"
              className="bg-white mx-2 w-20 text-grey"
              //   icon={<CheckedIcon size={20} />}
            />
          </div>
        </div>
        <div>
          {data.map((_, index) => {
            return <RankingItem key={index} title="충청남도 계룡시" />;
          })}
        </div>
      </div>
    </>
  );
};

export default RankingClient;
