"use client";

import { type RankingInfo } from "@api/marker/marker-ranking";
import Text from "@common/text";
import { useRouter } from "next/navigation";
import { BsChevronRight } from "react-icons/bs";

const Hot = ({ data }: { data: RankingInfo[] }) => {
  const router = useRouter();

  if (data.length <= 0) return null;

  return (
    <div className="mb-4 mt-3">
      <Text fontWeight="bold" className="mb-1 px-4">
        인기 철봉 TOP3
      </Text>
      {data.map((marker) => {
        return (
          <button
            key={marker.markerId}
            className="block w-full active:bg-grey-light hover:bg-grey-light dark:active:bg-grey dark:hover:bg-grey"
            onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
          >
            <div className="py-1 px-4 flex items-center">
              <div className="shrink-0 mr-2">🏅</div>
              <div className="flex grow">
                <Text typography="t6" className="break-all">
                  {marker.address}
                </Text>
              </div>
              <div className="shrink-0">
                <BsChevronRight className="text-grey-dark dark:text-grey" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Hot;
