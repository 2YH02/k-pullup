"use client";

import closeMarker, { type CloseMarker } from "@api/marker/close-marker";
import Button from "@common/button";
import Section, { SectionTitle } from "@common/section";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import PinIcon from "@icons/pin-icon";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface AroundSearchProps {
  address: string;
  lat: string;
  lng: string;
}

const AroundSearch = ({ address, lat, lng }: AroundSearchProps) => {
  const router = useRouter();
  const [distance, setDistance] = useState(5000);

  const [markers, setMarkers] = useState<CloseMarker[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreMarkers = useCallback(async () => {
    if (isLoading || currentPage >= totalPages || currentPage === 0) return;

    setIsLoading(true);
    const newData = await closeMarker({
      lat: Number(lat),
      lng: Number(lng),
      distance: distance,
      pageParam: currentPage + 1,
    });

    if (newData.error || newData.message) {
      return;
    }

    setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
    setCurrentPage(newData.currentPage);

    setIsLoading(false);
  }, [currentPage, isLoading, totalPages]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMarkers();
        }
      },
      {
        rootMargin: "400px",
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

  const handleSearch = async () => {
    setIsLoading(true);
    setMarkers([]);
    const data = await closeMarker({
      lat: Number(lat),
      lng: Number(lng),
      distance: distance,
      pageParam: currentPage,
    });

    if (data.error || data.message) {
      setIsLoading(false);
      setMarkers([]);
      return;
    }

    setMarkers(data.markers);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  };

  return (
    <Section>
      <SectionTitle title="주변 위치 탐색" />
      <div className="flex justify-between items-center">
        <Text display="block" className="break-all mr-6" typography="t6">
          {address} 주변 철봉
        </Text>
        <Text display="block">{distance}m</Text>
      </div>
      <div>
        <input
          type="range"
          id="opacityRange"
          className="w-full h-2 bg-primary-light appearance-none rounded-lg cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f9b4ab 0%, #f9b4ab ${
              (distance - 100) / 49
            }%, #facec8 ${(distance - 100) / 49}%, #facec8 100%)`,
          }}
          min="100"
          max="5000"
          step="100"
          value={distance}
          onChange={(e) => setDistance(parseInt(e.target.value))}
        />
      </div>
      <div className="mt-3">
        <Button onClick={handleSearch} size="sm">
          검색
        </Button>
      </div>

      <div>
        {markers ? (
          <>
            {markers?.map((marker, index) => {
              return (
                <li
                  key={`${marker.markerId}-${index}`}
                  className="border-b border-solid"
                >
                  <button
                    className="flex items-center p-3 text-left w-full h-full"
                    onClick={() => router.push(`/pullup/${marker.markerId}`)}
                  >
                    <div className="mr-3">
                      <PinIcon size={20} />
                    </div>
                    <Text>{marker.address}</Text>
                  </button>
                </li>
              );
            })}

            {isLoading && <Skeleton className="w-full h-10 rounded-lg mt-3" />}
            {totalPages > currentPage && (
              <div ref={loadMoreRef} className="w-full h-20" />
            )}
          </>
        ) : (
          <>
            <Text className="mt-5">주변에 철봉이 없습니다</Text>
          </>
        )}
      </div>
    </Section>
  );
};

export default AroundSearch;
