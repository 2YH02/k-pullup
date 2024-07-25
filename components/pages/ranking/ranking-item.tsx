"use client";

import Text from "@common/text";
import LocationIcon from "@icons/location-icon";
import { useState } from "react";

interface RankingItemProps {
  title: string;
  ranking: number;
}

const RankingItem = ({ title, ranking }: RankingItemProps) => {
  const [hover, setHover] = useState(false);

  return (
    <li>
      <button
        className="w-full h-full flex items-center py-5 px-2 border-b border-solid border-grey-light"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="w-14 mr-2">
          <Text typography="t4" fontWeight="bold">
            {ranking}
          </Text>
          <Text typography="t6">등</Text>
        </div>
        <div className="flex justify-between items-center w-full">
          <div>
            <Text>{title}</Text>
          </div>
          <div>
            <LocationIcon
              className={`${
                hover ? "web:fill-primary" : "web:fill-grey-dark"
              } mo:fill-grey-dark dark:fill-white`}
            />
          </div>
        </div>
      </button>
    </li>
  );
};

export default RankingItem;
