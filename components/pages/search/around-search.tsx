"use client";

import cn from "@/lib/cn";
import closeMarker, { type CloseMarker } from "@api/marker/close-marker";
import Section from "@common/section";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import LocationIcon from "@icons/location-icon";
import PinIcon from "@icons/pin-icon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface AroundSearchProps {
  address: string;
  lat: string;
  lng: string;
}

// Preset distance options
const DISTANCE_PRESETS = [
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "3km", value: 3000 },
  { label: "5km", value: 5000 },
];

const AroundSearch = ({ address, lat, lng }: AroundSearchProps) => {
  const router = useRouter();
  const [distance, setDistance] = useState(1000);

  const [markers, setMarkers] = useState<CloseMarker[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mini map references
  const miniMapRef = useRef<HTMLDivElement | null>(null);
  const miniMapInstanceRef = useRef<any>(null);
  const circleOverlayRef = useRef<any>(null);

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
      setIsLoading(false);
      return;
    }

    setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
    setCurrentPage(newData.currentPage);

    setIsLoading(false);
  }, [currentPage, isLoading, totalPages, lat, lng, distance]);

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

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setMarkers([]);
    setCurrentPage(1);

    // Calculate how many pages to load initially based on radius
    const smartCount = getSmartDisplayCount(distance);
    const initialPagesToLoad = Math.ceil(smartCount / 10); // Backend returns ~10 per page

    try {
      // Load initial pages in parallel
      const pagePromises = Array.from({ length: initialPagesToLoad }, (_, i) =>
        closeMarker({
          lat: Number(lat),
          lng: Number(lng),
          distance: distance,
          pageParam: i + 1,
        })
      );

      const results = await Promise.all(pagePromises);

      // Check if first request failed
      if (results[0].error || results[0].message) {
        setIsLoading(false);
        setMarkers([]);
        setHasSearched(true);
        return;
      }

      // Combine all markers from loaded pages
      const allMarkers = results.flatMap(result =>
        result.markers || []
      );

      setMarkers(allMarkers);
      setCurrentPage(initialPagesToLoad);
      setTotalPages(results[0].totalPages || 0);
      setIsLoading(false);
      setHasSearched(true);
    } catch (error) {
      setIsLoading(false);
      setMarkers([]);
      setHasSearched(true);
    }
  }, [lat, lng, distance]);

  // Initialize mini Kakao Map
  useEffect(() => {
    if (!miniMapRef.current || !window.kakao?.maps) return;

    const container = miniMapRef.current;
    const center = new window.kakao.maps.LatLng(Number(lat), Number(lng));

    const options = {
      center: center,
      level: 7, // Zoom level
      draggable: false,
      scrollwheel: false,
      disableDoubleClick: true,
      disableDoubleClickZoom: true,
    };

    // Create mini map
    const miniMap = new window.kakao.maps.Map(container, options);
    miniMapInstanceRef.current = miniMap;

    // Add center marker
    const markerPosition = new window.kakao.maps.LatLng(Number(lat), Number(lng));
    new window.kakao.maps.Marker({
      position: markerPosition,
      map: miniMap,
    });

    return () => {
      if (circleOverlayRef.current) {
        circleOverlayRef.current.setMap(null);
      }
    };
  }, [lat, lng]);

  // Update circle overlay when distance changes
  useEffect(() => {
    if (!miniMapInstanceRef.current || !window.kakao?.maps) return;

    // Remove old circle
    if (circleOverlayRef.current) {
      circleOverlayRef.current.setMap(null);
    }

    // Draw new circle
    const center = new window.kakao.maps.LatLng(Number(lat), Number(lng));
    const circle = new window.kakao.maps.Circle({
      center: center,
      radius: distance,
      strokeWeight: 3,
      strokeColor: '#f472b6',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
      fillColor: '#f472b6',
      fillOpacity: 0.15,
    });

    circle.setMap(miniMapInstanceRef.current);
    circleOverlayRef.current = circle;

    // Adjust zoom level based on distance
    let newLevel = 7;
    if (distance <= 500) newLevel = 6;
    else if (distance <= 1000) newLevel = 7;
    else if (distance <= 3000) newLevel = 8;
    else newLevel = 9;

    miniMapInstanceRef.current.setLevel(newLevel);
  }, [distance, lat, lng]);

  // Auto-search with debounce when distance changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [distance, handleSearch]);

  // Format distance display
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)}km`;
    }
    return `${meters}m`;
  };

  // Smart initial display count based on search radius
  const getSmartDisplayCount = (searchRadius: number) => {
    if (searchRadius <= 500) return 10;
    if (searchRadius <= 1000) return 15;
    if (searchRadius <= 3000) return 20;
    return 30; // 5km
  };

  // Group markers by distance similarity
  const groupMarkersByDistance = (markers: CloseMarker[]) => {
    if (markers.length === 0) return [];

    // Sort by distance
    const sorted = [...markers].sort((a, b) =>
      (a.distance || 0) - (b.distance || 0)
    );

    const smartCount = getSmartDisplayCount(distance);

    // If we have fewer markers than the smart count, show all
    if (sorted.length <= smartCount) {
      return sorted;
    }

    // Get markers up to smart count
    const initialMarkers = sorted.slice(0, smartCount);
    const lastMarker = initialMarkers[initialMarkers.length - 1];

    // Check if there are more markers at similar distance (within 100m)
    const similarDistanceMarkers = [];
    for (let i = smartCount; i < sorted.length; i++) {
      const marker = sorted[i];
      if (marker.distance && lastMarker.distance) {
        const distanceDiff = marker.distance - lastMarker.distance;
        // If within 100m of the last shown marker, include it
        if (distanceDiff <= 100) {
          similarDistanceMarkers.push(marker);
        } else {
          break;
        }
      }
    }

    return [...initialMarkers, ...similarDistanceMarkers];
  };

  // Get display markers with smart grouping
  const displayMarkers = groupMarkersByDistance(markers);
  const hasMoreNearby = markers.length > displayMarkers.length;

  return (
    <Section>
      {/* Current Location Card */}
      <div className={cn(
        "p-4 rounded-lg border border-grey-light dark:border-grey-dark",
        "bg-linear-to-br from-primary/5 to-transparent dark:from-primary-dark/10",
        "mb-6"
      )}>
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center">
            <LocationIcon size={20} color="primary" />
          </div>
          <div className="flex-1 min-w-0">
            <Text typography="t7" className="text-grey dark:text-grey mb-1">
              현재 위치
            </Text>
            <div className="truncate" title={address}>
              <Text
                className="truncate"
                fontWeight="bold"
                typography="t6"
              >
                {address}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Radius Selector with Mini Map */}
      <div className={cn(
        "p-6 rounded-lg border-2 border-grey-light dark:border-grey-dark",
        "bg-white dark:bg-black",
        "mb-6"
      )}>
        {/* Kakao Map with Radius Overlay */}
        <div className="relative w-full aspect-square max-w-70 mx-auto mb-6 rounded-lg overflow-hidden">
          <div
            ref={miniMapRef}
            className="w-full h-full"
          />
          {/* Distance overlay badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-black/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-lg border border-grey-light dark:border-grey-dark">
            <Text typography="t7" fontWeight="bold" className="text-primary dark:text-primary-dark">
              {formatDistance(distance)} 반경
            </Text>
          </div>
        </div>

        {/* Distance Display */}
        <div className="text-center mb-6">
          <Text typography="t6" className="text-grey dark:text-grey mb-2">
            검색 반경
          </Text>
          <div className="flex items-baseline justify-center gap-2">
            <Text typography="t2" fontWeight="bold" className="text-primary dark:text-primary-dark">
              {formatDistance(distance)}
            </Text>
          </div>
          <Text typography="t7" className="text-grey dark:text-grey mt-1">
            이내의 철봉을 찾습니다
          </Text>
        </div>

        {/* Preset Distance Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {DISTANCE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDistance(preset.value)}
              className={cn(
                "py-3 px-2 rounded-lg text-sm font-medium transition-all",
                "border-2",
                distance === preset.value
                  ? "bg-primary dark:bg-primary-dark text-white border-primary dark:border-primary-dark shadow-md scale-105"
                  : "bg-white dark:bg-black border-grey-light dark:border-grey-dark text-black dark:text-white hover:border-primary dark:hover:border-primary-dark hover:scale-105"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        {isLoading && displayMarkers.length === 0 ? (
          // Initial loading state
          <div className="space-y-2">
            <Text typography="t6" className="text-grey dark:text-grey mb-3">
              검색 중...
            </Text>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-14 rounded-lg" />
            ))}
          </div>
        ) : displayMarkers.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-3">
              <Text typography="t6" fontWeight="bold">
                가까운 순
              </Text>
              <Text typography="t7" className="text-grey dark:text-grey">
                {displayMarkers.length}개 표시
                {hasMoreNearby && ` (총 ${markers.length}개)`}
              </Text>
            </div>

            {/* Distance info badge */}
            {displayMarkers.length > 0 && (
              <div className="mb-3 p-2 rounded-lg bg-primary/5 dark:bg-primary-dark/5 border border-primary/20 dark:border-primary-dark/20">
                <Text typography="t7" className="text-grey dark:text-grey text-center">
                  {distance <= 1000
                    ? "가까운 철봉부터 표시됩니다"
                    : "넓은 반경에서 가까운 철봉부터 표시됩니다"
                  }
                </Text>
              </div>
            )}

            {/* Results List */}
            <ul className="space-y-2">
              {displayMarkers.map((marker, index) => (
                <li
                  key={`${marker.markerId}-${index}`}
                >
                  <button
                    className={cn(
                      "flex items-center gap-3 p-3 text-left w-full rounded-lg",
                      "border border-grey-light dark:border-grey-dark",
                      "hover:border-primary dark:hover:border-primary-dark",
                      "hover:bg-primary/5 dark:hover:bg-primary-dark/10",
                      "transition-all group"
                    )}
                    onClick={() => router.push(`/pullup/${marker.markerId}`)}
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary-dark/20 flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary-dark/30 transition-colors">
                      <PinIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate" title={marker.address}>
                        <Text
                          typography="t6"
                          className="truncate block"
                        >
                          {marker.address}
                        </Text>
                      </div>
                      {marker.distance && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-primary dark:bg-primary-dark" />
                          <Text typography="t7" className="text-primary dark:text-primary-dark font-medium">
                            {marker.distance >= 1000
                              ? `${(marker.distance / 1000).toFixed(1)}km`
                              : `${Math.round(marker.distance)}m`
                            } 거리
                          </Text>
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>

            {/* Show more nearby button */}
            {hasMoreNearby && (
              <div className="mt-4 p-4 rounded-lg border-2 border-dashed border-grey-light dark:border-grey-dark bg-grey-light/20 dark:bg-grey-dark/20 text-center">
                <Text typography="t6" display="block" className="text-grey dark:text-grey mb-2">
                  더 먼 곳에 {markers.length - displayMarkers.length}개의 철봉이 있습니다
                </Text>
                <Text typography="t7" className="text-grey dark:text-grey">
                  아래로 스크롤하여 더 보기
                </Text>
              </div>
            )}

            {/* Loading more skeleton */}
            {isLoading && (
              <Skeleton className="w-full h-14 rounded-lg mt-2" />
            )}

            {/* Infinite scroll trigger */}
            {totalPages > currentPage && (
              <div ref={loadMoreRef} className="w-full h-20" />
            )}
          </>
        ) : hasSearched ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-10">
            <Image
              src="/empty-search.gif"
              alt="empty-search"
              width={200}
              height={150}
              className="mb-4 opacity-80"
            />
            <Text
              typography="t5"
              fontWeight="bold"
              display="block"
              textAlign="center"
              className="mb-2"
            >
              주변에 철봉이 없습니다
            </Text>
            <Text
              typography="t6"
              display="block"
              textAlign="center"
              className="text-grey dark:text-grey"
            >
              검색 반경을 늘려보시거나<br />
              다른 위치에서 시도해보세요
            </Text>
          </div>
        ) : null}
      </div>
    </Section>
  );
};

export default AroundSearch;
