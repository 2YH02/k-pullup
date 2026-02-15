"use client";

import type {
  RegisteredMarker,
  RegisteredMarkerRes,
} from "@api/user/my-registered-location";
import myRegisteredLocation from "@api/user/my-registered-location";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";
import ArrowRightIcon from "@icons/arrow-right-icon";
import PinIcon from "@icons/pin-icon";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface RegisteredListProps {
  data: RegisteredMarkerRes;
}

const RegisteredLocateList = ({ data }: RegisteredListProps) => {
  const router = useRouter();

  const { move } = useMapControl();

  const [markers, setMarkers] = useState<RegisteredMarker[]>(data.markers);
  const [currentPage, setCurrentPage] = useState(data.currentPage);

  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreMarkers = useCallback(async () => {
    if (isLoading || currentPage >= data.totalPages) return;

    setIsLoading(true);
    const newData = await myRegisteredLocation({
      pageParam: currentPage + 1,
    });

    setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
    setCurrentPage(newData.currentPage);

    setIsLoading(false);
  }, [currentPage, isLoading, data.totalPages]);

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

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {markers.map((marker) => {
          return (
            <li key={marker.markerId}>
              <button
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary/10 bg-surface/80 px-3 py-2.5 text-left transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-white/70 active:scale-[0.995] dark:border-grey-dark dark:bg-black dark:web:hover:bg-black-light"
                onClick={() => {
                  move({ lat: marker.latitude, lng: marker.longitude });
                  router.push(`/pullup/${marker.markerId}`);
                }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 dark:bg-primary-dark/20">
                  <PinIcon size={24} />
                </span>
                <span className="min-w-0 grow">
                  <Text
                    typography="t6"
                    className="block break-words font-semibold text-primary dark:text-primary-light"
                  >
                    {marker.address || "주소 정보 없음"}
                  </Text>
                  <Text
                    typography="t7"
                    className="mt-0.5 block break-words text-grey-dark dark:text-grey"
                  >
                    {marker.description || "설명 없음"}
                  </Text>
                </span>
                <span className="shrink-0 text-grey-dark transition-transform duration-180 ease-out group-hover:translate-x-px dark:text-grey motion-reduce:transform-none">
                  <ArrowRightIcon size={16} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={`registered-locate-loading-${index}`}
              className="h-14 w-full rounded-xl"
            />
          ))}
        </div>
      )}
      {data.totalPages > currentPage && <div ref={loadMoreRef} className="h-16 w-full" />}
    </div>
  );
};

export default RegisteredLocateList;
