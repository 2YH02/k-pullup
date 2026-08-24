"use client";

import { type RankingInfo } from "@api/marker/marker-ranking";
import Text from "@common/text";
import { ChevronRight, Medal } from "lucide-react";
import { useRouter } from "next/navigation";

const Hot = ({ data }: { data: RankingInfo[] }) => {
  const router = useRouter();

  if (data.length <= 0) return null;

  return (
    <div className="mt-2 mb-5 px-4">
      <Text
        fontWeight="bold"
        className="mb-2 text-text-on-surface dark:text-grey-light"
      >
        인기 철봉 TOP3
      </Text>
      <div className="rounded-xl border border-border/85 bg-surface/45 p-1.5 dark:border-black-light/75 dark:bg-black-light/30">
        {data.map((marker, index) => {
          const rank = index + 1;
          return (
            <button
              key={marker.markerId}
              className="group flex w-full items-center rounded-lg px-2.5 py-2 text-left transition-[transform,background-color] duration-150 active:scale-[0.99] active:bg-surface dark:active:bg-black-light/55"
              onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
            >
              <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-surface text-primary dark:border-primary-light/35 dark:bg-black-light/75 dark:text-primary-light">
                {rank === 1 ? (
                  <Medal size={14} strokeWidth={2.3} />
                ) : (
                  <span className="text-[11px] font-semibold">{rank}</span>
                )}
              </div>
              <div className="grow">
                <Text
                  typography="t6"
                  className="break-all text-text-on-surface dark:text-grey-light"
                >
                  {marker.address}
                </Text>
              </div>
              <div className="ml-2 shrink-0">
                <ChevronRight
                  size={16}
                  strokeWidth={2.3}
                  className="text-grey-dark transition-transform duration-150 group-active:translate-x-px dark:text-grey"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Hot;
