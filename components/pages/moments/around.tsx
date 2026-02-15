"use client";

import Skeleton from "@common/skeleton";
import Text from "@common/text";
import closeMarker, { CloseMarker } from "@lib/api/marker/close-marker";
import useGeolocationStore from "@store/useGeolocationStore";
import { ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const dedupeMarkersByAddress = (markers: CloseMarker[]) => {
  const seen = new Set<string>();

  return markers.filter((marker) => {
    const normalizedAddress = (marker.address || "")
      .replace(/\s+/g, " ")
      .trim();
    const key = normalizedAddress || `marker-${marker.markerId}`;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const Around = () => {
  const router = useRouter();
  const { myLocation } = useGeolocationStore();

  const [markers, setMarkers] = useState<CloseMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!myLocation) {
      setIsLoading(false);
      setMarkers([]);
      return;
    }

    let cancelled = false;

    const handleSearch = async () => {
      setIsLoading(true);
      const data = await closeMarker({
        lat: myLocation.lat,
        lng: myLocation.lng,
        distance: 1500,
        pageParam: 1,
      });

      if (data.error || data.message) {
        if (cancelled) return;
        setMarkers([]);
        setIsLoading(false);
        return;
      }

      if (cancelled) return;
      const deduped = dedupeMarkersByAddress(data.markers);
      setMarkers(deduped.slice(0, 5));
      setIsLoading(false);
    };

    handleSearch();

    return () => {
      cancelled = true;
    };
  }, [myLocation]);

  if (!myLocation) {
    return (
      <div className="mb-8 px-4">
        <Text fontWeight="bold" className="mb-2 text-text-on-surface dark:text-grey-light">
          근처 추천 철봉
        </Text>
        <div className="rounded-xl border border-grey-light/85 bg-search-input-bg/45 px-3.5 py-3 dark:border-grey-dark/85 dark:bg-black/30">
          <Text typography="t6" display="block" className="text-grey-dark dark:text-grey">
            주변 철봉에서 모먼트를 공유해보세요.
          </Text>
          <Text typography="t6" display="block" className="text-grey-dark dark:text-grey">
            위치 권한을 허용하면 추천 목록을 볼 수 있어요.
          </Text>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-8 px-4">
        <Text fontWeight="bold" className="mb-2 text-text-on-surface dark:text-grey-light">
          근처 추천 철봉
        </Text>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!markers || markers.length <= 0) {
    return null;
  }

  return (
    <div className="mb-8 px-4">
      <Text fontWeight="bold" className="mb-2 text-text-on-surface dark:text-grey-light">
        근처 추천 철봉
      </Text>
      <div className="rounded-xl border border-grey-light/85 bg-search-input-bg/40 p-1.5 dark:border-grey-dark/85 dark:bg-black/30">
        {markers.map((marker) => {
          return (
            <button
              key={marker.markerId}
              className="group flex w-full items-center rounded-lg px-2.5 py-2 text-left transition-[transform,background-color] duration-150 active:scale-[0.99] active:bg-search-input-bg/75 dark:active:bg-grey-dark/35"
              onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
            >
              <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-location-badge-bg/85 bg-location-badge-bg/70 text-location-badge-text dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/50 dark:text-location-badge-text-dark">
                <MapPin size={14} strokeWidth={2.2} />
              </div>
              <div className="grow">
                <Text
                  typography="t6"
                  className="break-all text-text-on-surface dark:text-grey-light"
                  display="block"
                >
                  {marker.address}
                </Text>
                <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
                  내 위치에서{" "}
                  <span className="font-bold text-primary dark:text-primary-light">
                    {Math.floor(marker.distance)}m
                  </span>
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

export default Around;
