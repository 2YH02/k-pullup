"use client";

import useGpsTracking from "@hooks/useGpsTracking";
import { useToast } from "@hooks/useToast";
import LocationIcon from "@icons/location-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import cn from "@lib/cn";
import { Loader2, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

const GPS_GUIDE_KEY = "gps-guide-shown";
const WRAPPER_CLASS_NAME =
  "flex items-center";
const BADGE_CLASS_NAME = cn(
  "flex items-center gap-2",
  "pl-3 pr-2 py-2 rounded-full",
  "bg-location-badge-bg dark:bg-location-badge-bg-dark"
);
const BADGE_TEXT_CLASS_NAME = cn(
  "text-[14px] font-bold leading-none whitespace-nowrap",
  "text-location-badge-text dark:text-location-badge-text-dark"
);
const GPS_BUTTON_BASE_CLASS_NAME =
  "w-7 h-7 rounded-full border border-location-badge-text/15 dark:border-location-badge-text-dark/25 bg-white/70 dark:bg-black/35 flex items-center justify-center transition-colors active:bg-grey-light dark:active:bg-grey-dark disabled:opacity-60";
const GUIDE_BUBBLE_CLASS_NAME =
  "absolute -bottom-12 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-fade-in pointer-events-none z-50";

const LocationBadge = () => {
  // TODO: 주소 가져오기 이후 훅 분리 필요 (search/around-client 에서 사용 중)
  const { region, regionLoading, geoLocationError } = useGeolocationStore();
  const { toast } = useToast();
  const [showGuide, setShowGuide] = useState(false);

  // Use GPS tracking hook for mobile
  const { gpsState, handleGps } = useGpsTracking({
    deviceType: "mobile",
    onSuccess: (message) => toast({ description: message }),
    onError: (message) => toast({ description: message, variant: "destructive" }),
  });

  // Check if guide should be shown (first visit on mobile)
  useEffect(() => {
    // Only show on mobile
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;

    // Check if guide was already shown
    const guideShown = sessionStorage.getItem(GPS_GUIDE_KEY);
    if (!guideShown) {
      // Show guide after a short delay
      const showTimer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);

      // Auto hide after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowGuide(false);
        sessionStorage.setItem(GPS_GUIDE_KEY, "true");
      }, 3000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  // Handle GPS button click
  const handleGpsClick = () => {
    // Mark guide as shown
    if (showGuide) {
      sessionStorage.setItem(GPS_GUIDE_KEY, "true");
      setShowGuide(false);
    }
    handleGps();
  };
  const hasRegion = !!region && !geoLocationError;
  const title = hasRegion
    ? region.region_2depth_name !== "" || region.region_3depth_name !== ""
      ? `${region.region_2depth_name} ${region.region_3depth_name}`
      : region.address_name
    : "위치 정보 없음";
  const iconClassName = "fill-location-badge-text dark:fill-location-badge-text-dark";
  const iconElement = hasRegion && regionLoading
    ? <Loader2 size={17} className="stroke-location-badge-text dark:stroke-location-badge-text-dark animate-spin" />
    : <LocationIcon size={17} className={iconClassName} />;

  return (
    <div className={WRAPPER_CLASS_NAME}>
      <div className="relative">
        <div className={BADGE_CLASS_NAME}>
          {iconElement}
          <span className={BADGE_TEXT_CLASS_NAME}>{title}</span>
          <button
            onClick={handleGpsClick}
            disabled={gpsState === "locating"}
            className={cn(
              GPS_BUTTON_BASE_CLASS_NAME,
              "web:hidden",
              showGuide && "animate-pulse-focus"
            )}
            aria-label={gpsState === "locating" ? "위치 찾는 중..." : "내 위치로 이동"}
          >
            {gpsState === "locating" ? (
              <Loader2 size={16} className="stroke-location-badge-text dark:stroke-location-badge-text-dark animate-spin" />
            ) : (
              <Navigation
                size={16}
                style={{
                  fill: gpsState === "success"
                    ? "var(--color-green)"
                    : gpsState === "error"
                      ? "var(--color-red)"
                      : "var(--color-location-badge-text)",
                  stroke: gpsState === "success"
                    ? "var(--color-green)"
                    : gpsState === "error"
                      ? "var(--color-red)"
                      : "var(--color-location-badge-text)",
                }}
              />
            )}
          </button>
        </div>
        {showGuide && (
          <div className={cn(GUIDE_BUBBLE_CLASS_NAME, "web:hidden")}>
            실시간 위치 추적 시작
            <div className="absolute -top-1 right-4 w-2 h-2 bg-black/80 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationBadge;
