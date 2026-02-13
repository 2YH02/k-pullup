"use client";

import Section from "@/components/common/section";
import userMarkers, {
  type UserMarker,
  type UserMarkerRes,
} from "@api/marker/user-marker";
import GrowBox from "@common/grow-box";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPinMapFill } from "react-icons/bs";

interface Props {
  data: UserMarkerRes;
  userName: string;
}

const PageClient = ({ data, userName }: Props) => {
  const router = useRouter();

  const [markers, setMarkers] = useState<UserMarker[]>(data.markers);
  const [currentPage, setCurrentPage] = useState(data.currentPage);

  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreMarkers = useCallback(async () => {
    if (isLoading || currentPage >= data.totalPages) return;

    setIsLoading(true);
    const newData = await userMarkers({
      userName: userName,
      page: currentPage + 1,
    });

    setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
    setCurrentPage(newData.currentPage);

    setIsLoading(false);
  }, [userName, currentPage, isLoading, data.totalPages]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMarkers();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreMarkers]);

  if (!markers || markers.length === 0) {
    return (
      <Section>
        <p>{userName}님이 등록한 위치가 없습니다.</p>
      </Section>
    );
  }
  return (
    <div>
      <ul>
        {markers.map((marker) => {
          return (
            <li
              key={marker.markerId}
              className="border-b border-solid dark:border-grey-dark active:bg-grey-light dark:active:bg-grey-dark"
            >
              <button
                className="flex items-center p-2 px-4 text-left w-full h-full"
                onClick={() => {
                  router.push(`/pullup/${marker.markerId}`);
                }}
              >
                <div className="w-[90%] flex flex-col">
                  <Text typography="t6" className="break-all">
                    {marker.address}
                  </Text>
                  <Text
                    typography="t7"
                    className="break-all text-grey dark:text-grey"
                  >
                    {marker.description || "설명이 없습니다."}
                  </Text>
                </div>
                <GrowBox />
                <div className="shrink-0 w-[10%] flex items-center justify-center">
                  <BsPinMapFill className="fill-primary" />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {isLoading && (
        <div className="p-4">
          <Skeleton className="w-full h-16 rounded-lg" />
        </div>
      )}
      {data.totalPages > currentPage && (
        <div ref={loadMoreRef} className="w-full h-20" />
      )}
    </div>
  );
};

export default PageClient;
