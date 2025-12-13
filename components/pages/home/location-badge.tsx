"use client";

import Badge from "@common/badge";
import useGpsTracking from "@hooks/useGpsTracking";
import { useToast } from "@hooks/useToast";
import LocationIcon from "@icons/location-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import { Loader2, Navigation } from "lucide-react";
import { useEffect, useState } from "react";

const GPS_GUIDE_KEY = "gps-guide-shown";

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

  if (!region || geoLocationError) {
    return (
      <div className="flex items-center w-full web:justify-center mo:justify-between">
        <Badge
          text="위치 정보 없음"
          icon={<LocationIcon size={18} className="fill-primary" />}
          className="border-none"
        />
        {/* Mobile GPS button - right aligned */}
        <div className="relative web:hidden">
          <button
            onClick={handleGpsClick}
            disabled={gpsState === "locating"}
            className={`p-1.5 rounded-md active:bg-grey-light dark:active:bg-grey-dark transition-colors disabled:opacity-50 ${
              showGuide ? "animate-pulse-focus" : ""
            }`}
            aria-label={gpsState === "locating" ? "위치 찾는 중..." : "내 위치로 이동"}
          >
            {gpsState === "locating" ? (
              <Loader2 size={20} className="stroke-primary animate-spin" />
            ) : (
              <Navigation
                size={20}
                className={
                  gpsState === "success"
                    ? "fill-green-600 stroke-green-600"
                    : gpsState === "error"
                    ? "fill-red-600 stroke-red-600"
                    : "fill-primary stroke-primary"
                }
              />
            )}
          </button>
          {showGuide && (
            <div className="absolute -bottom-12 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-fade-in pointer-events-none">
              실시간 위치 추적 시작
              <div className="absolute -top-1 right-4 w-2 h-2 bg-black/80 rotate-45" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const { region_2depth_name, region_3depth_name, address_name } = region;
  const title =
    region_2depth_name !== "" || region_3depth_name !== ""
      ? `${region_2depth_name} ${region_3depth_name}`
      : address_name;

  return (
    <div className="flex items-center w-full web:justify-center mo:justify-between">
      <div className="flex items-center gap-1.5">
        <Badge
          text={title as string}
          icon={<LocationIcon size={18} className="fill-primary" />}
          className="pl-[5px] border-none"
        />
        {regionLoading && (
          <Loader2 size={16} className="stroke-primary animate-spin" />
        )}
      </div>
      {/* Mobile GPS button - right aligned */}
      <div className="relative web:hidden">
        <button
          onClick={handleGpsClick}
          disabled={gpsState === "locating"}
          className={`p-1.5 rounded-md active:bg-grey-light dark:active:bg-grey-dark transition-colors disabled:opacity-50 ${
            showGuide ? "animate-pulse-focus" : ""
          }`}
          aria-label={gpsState === "locating" ? "위치 찾는 중..." : "내 위치로 이동"}
        >
          {gpsState === "locating" ? (
            <Loader2 size={20} className="stroke-primary animate-spin" />
          ) : (
            <Navigation
              size={20}
              className={
                gpsState === "success"
                  ? "fill-green-600 stroke-green-600"
                  : gpsState === "error"
                  ? "fill-red-600 stroke-red-600"
                  : "fill-primary stroke-primary"
              }
            />
          )}
        </button>
        {showGuide && (
          <div className="absolute -bottom-12 right-0 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap animate-fade-in pointer-events-none z-50">
            실시간 위치 추적 시작
            <div className="absolute -top-1 right-4 w-2 h-2 bg-black/80 rotate-45" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationBadge;
