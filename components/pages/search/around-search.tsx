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
    const accentColor = getMapAccentColor();
    const circle = new window.kakao.maps.Circle({
      center: center,
      radius: distance,
      strokeWeight: 3,
      strokeColor: accentColor,
      strokeOpacity: 0.8,
      strokeStyle: "solid",
      fillColor: accentColor,
      fillOpacity: 0.16,
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

  const getMapAccentColor = () => {
    if (typeof window === "undefined") return "#6c705e";

    const root = document.documentElement;
    const styles = window.getComputedStyle(root);
    const isDark = root.classList.contains("dark");

    const lightColor = styles.getPropertyValue("--color-primary").trim();
    const darkColor = styles.getPropertyValue("--color-primary-light").trim();

    if (isDark) return darkColor || "#a5a58f";
    return lightColor || "#6c705e";
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
    <Section className="pb-6">
      {/* Current Location Card */}
      <div
        className={cn(
          "relative isolate overflow-hidden",
          "p-4 rounded-2xl border border-white/70 dark:border-white/10",
          "bg-search-input-bg/70 dark:bg-black/35 backdrop-blur-md",
          "shadow-[0_10px_24px_rgba(64,64,56,0.08)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)]",
          "mb-6"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-linear-to-br from-white/40 via-transparent to-primary/10",
            "dark:from-white/8 dark:to-primary-dark/22"
          )}
        />
        <div className="flex items-center gap-3">
          <div className="relative shrink-0 w-10 h-10 rounded-full border border-white/45 dark:border-white/10 bg-white/35 dark:bg-white/6 flex items-center justify-center">
            <LocationIcon size={20} color="primary" />
          </div>
          <div className="relative flex-1 min-w-0">
            <Text
              typography="t7"
              className="text-text-on-surface-muted dark:text-grey mb-1"
            >
              현재 위치
            </Text>
            <div className="truncate" title={address}>
              <Text className="truncate" fontWeight="bold" typography="t6">
                {address}
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Radius Selector with Mini Map */}
      <div
        className={cn(
          "relative isolate overflow-hidden",
          "p-5 rounded-2xl border border-white/70 dark:border-white/10",
          "bg-search-input-bg/65 dark:bg-black/32 backdrop-blur-md",
          "shadow-[0_10px_24px_rgba(64,64,56,0.08)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.3)]",
          "mb-6"
        )}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 pointer-events-none",
            "bg-linear-to-br from-white/35 via-transparent to-primary/8",
            "dark:from-white/8 dark:to-primary-dark/20"
          )}
        />
        {/* Kakao Map with Radius Overlay */}
        <div className="relative w-full aspect-square max-w-72 mx-auto mb-5 rounded-2xl overflow-hidden border border-white/55 dark:border-white/10 shadow-[0_12px_24px_rgba(64,64,56,0.12)] dark:shadow-[0_12px_24px_rgba(0,0,0,0.32)]">
          <div ref={miniMapRef} className="w-full h-full" />
          {/* Distance overlay badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/85 dark:bg-black/65 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/70 dark:border-white/12 shadow-[0_6px_16px_rgba(64,64,56,0.18)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
            <Text
              typography="t7"
              fontWeight="bold"
              className="text-primary dark:text-primary-light"
            >
              {formatDistance(distance)} 반경
            </Text>
          </div>
        </div>

        {/* Distance Display */}
        <div className="relative text-center mb-5">
          <Text
            typography="t6"
            className="text-text-on-surface-muted dark:text-grey mb-1.5"
          >
            검색 반경
          </Text>
          <div className="flex items-baseline justify-center gap-2">
            <Text
              typography="t2"
              fontWeight="bold"
              className="text-primary dark:text-primary-light"
            >
              {formatDistance(distance)}
            </Text>
          </div>
          <Text typography="t7" className="text-text-on-surface-muted dark:text-grey mt-1">
            이내의 철봉을 찾습니다
          </Text>
        </div>

        {/* Preset Distance Buttons */}
        <div className="relative grid grid-cols-4 gap-2">
          {DISTANCE_PRESETS.map((preset) => (
            <button
              type="button"
              key={preset.value}
              onClick={() => setDistance(preset.value)}
              aria-label={`${preset.label} 반경으로 설정`}
              className={cn(
                "py-2.5 px-2 rounded-xl text-sm font-semibold",
                "border transition-all duration-180 ease-out motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35",
                distance === preset.value
                  ? "bg-primary dark:bg-primary-light text-white dark:text-black border-primary dark:border-primary-light shadow-[0_8px_16px_rgba(64,64,56,0.22)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.32)] scale-[1.02]"
                  : "bg-white/55 dark:bg-white/6 border-white/70 dark:border-white/10 text-text-on-surface dark:text-grey-light hover:border-primary/45 dark:hover:border-primary-light/35 hover:bg-white/80 dark:hover:bg-white/10 active:scale-[0.98]"
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
          <div
            className={cn(
              "rounded-2xl p-4",
              "border border-white/70 dark:border-white/10",
              "bg-search-input-bg/55 dark:bg-black/25"
            )}
          >
            <Text typography="t6" className="text-text-on-surface-muted dark:text-grey mb-3">
              검색 중...
            </Text>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-full h-14 rounded-xl mb-2 last:mb-0" />
            ))}
          </div>
        ) : displayMarkers.length > 0 ? (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-3">
              <Text
                typography="t6"
                fontWeight="bold"
                className="text-text-on-surface dark:text-grey-light"
              >
                가까운 순
              </Text>
              <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                {displayMarkers.length}개 표시
                {hasMoreNearby && ` (총 ${markers.length}개)`}
              </Text>
            </div>

            {/* Distance info badge */}
            {displayMarkers.length > 0 && (
              <div className="mb-3 p-2.5 rounded-xl bg-primary/8 dark:bg-primary-dark/12 border border-primary/18 dark:border-primary-light/18 backdrop-blur-sm">
                <Text
                  typography="t7"
                  className="text-text-on-surface-muted dark:text-grey text-center"
                >
                  {distance <= 1000
                    ? "가까운 철봉부터 표시됩니다"
                    : "넓은 반경에서 가까운 철봉부터 표시됩니다"}
                </Text>
              </div>
            )}

            {/* Results List */}
            <ul className="space-y-2">
              {displayMarkers.map((marker, index) => (
                <li key={`${marker.markerId}-${index}`}>
                  <button
                    type="button"
                    className={cn(
                      "relative isolate overflow-hidden",
                      "flex items-center gap-3 p-3.5 text-left w-full rounded-xl",
                      "border border-white/70 dark:border-white/10",
                      "bg-search-input-bg/55 dark:bg-black/25 backdrop-blur-sm",
                      "transition-all duration-180 ease-out motion-reduce:transition-none group",
                      "hover:border-primary/45 dark:hover:border-primary-light/35 hover:shadow-[0_8px_18px_rgba(64,64,56,0.12)] dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)]",
                      "active:scale-[0.99]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
                    )}
                    onClick={() => router.push(`/pullup/${marker.markerId}`)}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "absolute inset-0 pointer-events-none",
                        "bg-linear-to-br from-white/32 via-transparent to-primary/10",
                        "dark:from-white/8 dark:to-primary-dark/18"
                      )}
                    />
                    <div className="relative shrink-0 w-10 h-10 rounded-full border border-white/45 dark:border-white/10 bg-white/45 dark:bg-white/7 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-180 ease-out motion-reduce:transition-none">
                      <PinIcon size={18} />
                    </div>
                    <div className="relative flex-1 min-w-0">
                      <div className="truncate" title={marker.address}>
                        <Text
                          typography="t6"
                          className="truncate block text-text-on-surface dark:text-grey-light"
                        >
                          {marker.address}
                        </Text>
                      </div>
                      {marker.distance && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-1 h-1 rounded-full bg-primary dark:bg-primary-dark" />
                          <Text typography="t7" className="text-primary dark:text-primary-light font-medium">
                            {marker.distance >= 1000
                              ? `${(marker.distance / 1000).toFixed(1)}km`
                              : `${Math.round(marker.distance)}m`}{" "}
                            거리
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
              <div className="mt-4 p-4 rounded-xl border border-dashed border-primary/30 dark:border-primary-light/28 bg-primary/6 dark:bg-primary-dark/10 text-center">
                <Text typography="t6" display="block" className="text-text-on-surface-muted dark:text-grey mb-2">
                  더 먼 곳에 {markers.length - displayMarkers.length}개의 철봉이 있습니다
                </Text>
                <Text typography="t7" className="text-text-on-surface-muted dark:text-grey">
                  아래로 스크롤하여 더 보기
                </Text>
              </div>
            )}

            {/* Loading more skeleton */}
            {isLoading && <Skeleton className="w-full h-14 rounded-xl mt-2" />}

            {/* Infinite scroll trigger */}
            {totalPages > currentPage && <div ref={loadMoreRef} className="w-full h-20" />}
          </>
        ) : hasSearched ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-white/70 dark:border-white/10 bg-search-input-bg/55 dark:bg-black/25 backdrop-blur-sm">
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
              className="mb-2 text-text-on-surface dark:text-grey-light"
            >
              주변에 철봉이 없습니다
            </Text>
            <Text
              typography="t6"
              display="block"
              textAlign="center"
              className="text-text-on-surface-muted dark:text-grey"
            >
              검색 반경을 늘려보시거나
              <br />
              다른 위치에서 시도해보세요
            </Text>
          </div>
        ) : null}
      </div>
    </Section>
  );
};

export default AroundSearch;
