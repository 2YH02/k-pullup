"use client";

import type {
  RegisteredMarker,
  RegisteredMarkerRes,
} from "@api/user/my-registered-location";
import myRegisteredLocation from "@api/user/my-registered-location";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface RegisteredListProps {
  data: RegisteredMarkerRes;
}

const RegisteredLocateList = ({ data }: RegisteredListProps) => {
  const { move } = useMapControl();

  const [markers, setMarkers] = useState<RegisteredMarker[]>(data.markers);
  const [currentPage, setCurrentPage] = useState(data.currentPage);

  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMoreMarkers = useCallback(async () => {
    if (loadingRef.current || loadError || currentPage >= data.totalPages)
      return;

    loadingRef.current = true;
    setIsLoading(true);
    try {
      const newData = await myRegisteredLocation({
        pageParam: currentPage + 1,
      });

      setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
      setCurrentPage(newData.currentPage);
    } catch {
      // 실패 시 loadError 로 표시해 observer 의 자동 재요청 루프를 막고
      // 명시적 재시도 액션에서만 다시 시도한다.
      setLoadError(true);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentPage, loadError, data.totalPages]);

  const retryLoadMore = useCallback(() => {
    setLoadError(false);
  }, []);

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
              <Link
                href={`/pullup/${marker.markerId}`}
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-primary/10 bg-search-input-bg/50 px-3 py-2.5 text-left transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-search-input-bg active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-grey-dark dark:bg-black/35 dark:web:hover:bg-black/45"
                onClick={() => {
                  move({ lat: marker.latitude, lng: marker.longitude });
                }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 dark:bg-primary-dark/20">
                  <MapPin size={18} strokeWidth={2} className="text-primary dark:text-primary-light" />
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
                  <ChevronRight size={17} strokeWidth={2.2} />
                </span>
              </Link>
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
      {loadError && (
        <div className="rounded-xl border border-primary/10 bg-search-input-bg/50 px-3 py-3 text-center dark:border-grey-dark dark:bg-black/35">
          <Text typography="t7" className="mb-2 block text-grey-dark dark:text-grey">
            목록을 더 불러오지 못했습니다.
          </Text>
          <button
            type="button"
            className="text-[13px] font-semibold text-primary underline transition-colors duration-150 active:text-primary-dark focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 rounded-sm dark:text-primary-light"
            onClick={retryLoadMore}
          >
            다시 시도
          </button>
        </div>
      )}
      {!loadError && data.totalPages > currentPage && (
        <div ref={loadMoreRef} className="h-16 w-full" />
      )}
    </div>
  );
};

export default RegisteredLocateList;
