"use client";

import userMarkers, {
  type UserMarker,
  type UserMarkerRes,
} from "@api/marker/user-marker";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import { ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  data: UserMarkerRes;
  userName: string;
  loadFailed?: boolean;
}

const PageClient = ({ data, userName, loadFailed = false }: Props) => {
  const [markers, setMarkers] = useState<UserMarker[]>(data.markers);
  const [currentPage, setCurrentPage] = useState(data.currentPage);

  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const loadMoreFailedRef = useRef(false);

  const loadMoreMarkers = useCallback(async () => {
    if (
      loadingRef.current ||
      loadMoreFailedRef.current ||
      currentPage >= data.totalPages
    )
      return;

    loadingRef.current = true;
    setIsLoading(true);
    try {
      const newData = await userMarkers({
        userName: userName,
        page: currentPage + 1,
      });

      setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
      setCurrentPage(newData.currentPage);
    } catch {
      loadMoreFailedRef.current = true;
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [userName, currentPage, data.totalPages]);

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

  if (loadFailed) {
    return (
      <div className="px-6 pb-6 pt-2">
        <div className="rounded-xl border border-grey-light/80 bg-search-input-bg/40 px-4 py-6 text-center dark:border-grey-dark/80 dark:bg-black/30">
          <Text typography="t6" display="block" className="text-text-on-surface dark:text-grey-light">
            장소 정보를 불러오지 못했습니다.
          </Text>
          <Text typography="t7" display="block" className="mt-1 text-grey-dark dark:text-grey">
            잠시 후 다시 확인해주세요.
          </Text>
        </div>
      </div>
    );
  }

  if (markers.length === 0) {
    return (
      <div className="px-6 pb-6 pt-2">
        <div className="rounded-xl border border-grey-light/80 bg-search-input-bg/40 px-4 py-7 text-center dark:border-grey-dark/80 dark:bg-black/30">
          <MapPin size={24} strokeWidth={1.8} className="mx-auto text-primary/75 dark:text-primary-light" />
          <Text typography="t6" fontWeight="bold" display="block" className="mt-3 text-text-on-surface dark:text-grey-light">
            등록한 장소가 없습니다.
          </Text>
          <Text typography="t7" display="block" className="mt-1 text-grey-dark dark:text-grey">
            등록한 장소가 생기면 여기에 표시됩니다.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6 pt-2">
      <ul className="space-y-2">
        {markers.map((marker) => {
          return (
            <li key={marker.markerId}>
              <Link
                href={`/pullup/${marker.markerId}`}
                className="group flex min-h-18 w-full items-center gap-3 rounded-xl border border-primary/10 bg-search-input-bg/50 px-3 py-3 text-left transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-search-input-bg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 motion-reduce:transform-none motion-reduce:transition-none dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-grey dark:web:hover:bg-black/45"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 dark:bg-primary-dark/20">
                  <MapPin size={18} strokeWidth={2} className="text-primary dark:text-primary-light" />
                </div>
                <div className="min-w-0 flex-1">
                  <Text typography="t6" fontWeight="bold" display="block" className="wrap-break-word text-text-on-surface dark:text-grey-light">
                    {marker.address || "주소 정보 없음"}
                  </Text>
                  <Text
                    typography="t7"
                    display="block"
                    className="mt-1 line-clamp-2 wrap-break-word text-grey-dark dark:text-grey"
                  >
                    {marker.description || "등록된 설명이 없습니다."}
                  </Text>
                </div>
                <ChevronRight size={17} strokeWidth={2.2} className="shrink-0 text-grey-dark transition-transform duration-180 group-hover:translate-x-px motion-reduce:transform-none dark:text-grey" />
              </Link>
            </li>
          );
        })}
      </ul>
      {isLoading && (
        <div className="pt-2">
          <Skeleton className="h-18 w-full rounded-xl" />
        </div>
      )}
      {data.totalPages > currentPage && (
        <div ref={loadMoreRef} className="h-16 w-full" />
      )}
    </div>
  );
};

export default PageClient;
