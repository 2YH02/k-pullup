"use client";

import Skeleton from "@common/skeleton";
import Text from "@common/text";
import closeMarker, { CloseMarker } from "@lib/api/marker/close-marker";
import useGeolocationStore from "@store/useGeolocationStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsChevronRight } from "react-icons/bs";

const Around = () => {
  const router = useRouter();
  const { myLocation } = useGeolocationStore();

  const [markers, setMarkers] = useState<CloseMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRef = useRef(false);

  useEffect(() => {
    if (!myLocation || fetchRef.current) return;
    const handleSearch = async () => {
      setIsLoading(true);
      setMarkers([]);
      const data = await closeMarker({
        lat: myLocation.lat,
        lng: myLocation.lng,
        distance: 1500,
        pageParam: 1,
      });

      if (data.error || data.message) {
        setIsLoading(false);
        setMarkers([]);
        fetchRef.current = true;
        return;
      }

      setMarkers(data.markers.slice(0, 5));
      setIsLoading(false);
      fetchRef.current = true;
    };

    handleSearch();
  }, [myLocation]);

  if (!myLocation) {
    return (
      <div className="mb-8 flex flex-col px-4">
        <Text fontWeight="bold" className="mb-1">
          근처 추천 철봉
        </Text>
        <Text typography="t6">주변 철봉에서 모먼트를 공유해보세요</Text>
        <Text typography="t6">위치 권한을 허용해 주세요!</Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4">
        <Skeleton className="w-full h-32" />
      </div>
    );
  }

  if (!markers || markers.length <= 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <Text fontWeight="bold" className="mb-1 px-4">
        근처 추천 철봉
      </Text>
      {markers.map((marker) => {
        return (
          <button
            key={marker.markerId}
            className="block w-full active:bg-grey-light hover:bg-grey-light dark:active:bg-grey dark:hover:bg-grey"
            onClick={() => router.push(`/pullup/${marker.markerId}/moment`)}
          >
            <div className="py-1 px-4 flex items-center">
              <div className="shrink-0 mr-2">📍</div>
              <div className="flex flex-col grow">
                <Text typography="t6" className="break-all">
                  {marker.address}
                </Text>
                <Text typography="t7" className="text-grey">
                  내 위치에서{" "}
                  <span className="text-primary font-bold">
                    {Math.floor(marker.distance)}m
                  </span>
                </Text>
              </div>
              <div className="shrink-0">
                <BsChevronRight />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Around;
