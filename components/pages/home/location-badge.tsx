"use client";

import Badge from "@common/badge";
import useGpsTracking from "@hooks/useGpsTracking";
import { useToast } from "@hooks/useToast";
import LocationIcon from "@icons/location-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import { Loader2, Navigation } from "lucide-react";

const LocationBadge = () => {
  // TODO: 주소 가져오기 이후 훅 분리 필요 (search/around-client 에서 사용 중)
  const { region, geoLocationError } = useGeolocationStore();
  const { toast } = useToast();

  // Use GPS tracking hook for mobile
  const { gpsState, handleGps } = useGpsTracking({
    deviceType: "mobile",
    onSuccess: (message) => toast({ description: message }),
    onError: (message) => toast({ description: message, variant: "destructive" }),
  });

  if (!region || geoLocationError) {
    return (
      <div className="flex items-center w-full web:justify-center mo:justify-between">
        <Badge
          text="위치 정보 없음"
          icon={<LocationIcon size={18} className="fill-primary" />}
          className="border-none"
        />
        {/* Mobile GPS button - right aligned */}
        <button
          onClick={handleGps}
          disabled={gpsState === "locating"}
          className="web:hidden p-1.5 rounded-md active:bg-grey-light dark:active:bg-grey-dark transition-colors disabled:opacity-50"
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
      <Badge
        text={title as string}
        icon={<LocationIcon size={18} className="fill-primary" />}
        className="pl-[5px] border-none"
      />
      {/* Mobile GPS button - right aligned */}
      <button
        onClick={handleGps}
        disabled={gpsState === "locating"}
        className="web:hidden p-1.5 rounded-md active:bg-grey-light dark:active:bg-grey-dark transition-colors disabled:opacity-50"
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
    </div>
  );
};

export default LocationBadge;
