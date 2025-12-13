import { useCallback, useEffect, useRef, useState } from "react";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import useAlertStore from "@store/useAlertStore";
import createUserLocationMarker from "@lib/create-user-location-marker";
import useCompass from "@hooks/useCompass";

export type GpsState = "idle" | "locating" | "success" | "error";

interface UseGpsTrackingOptions {
  deviceType?:
    | "desktop"
    | "mobile"
    | "android-mobile-app"
    | "ios-mobile-app"
    | "android-mobile-web"
    | "ios-mobile-web";
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

interface UseGpsTrackingReturn {
  gpsState: GpsState;
  handleGps: () => void;
}

/**
 * Custom hook for GPS tracking functionality
 * Handles location tracking, marker updates, and cleanup
 *
 * @param options - Configuration options
 * @returns GPS state and handler function
 */
const useGpsTracking = ({
  deviceType = "desktop",
  onSuccess,
  onError,
}: UseGpsTrackingOptions = {}): UseGpsTrackingReturn => {
  const { myLocation, setCurLocation, setMyLocation, setGeoLocationError } =
    useGeolocationStore();
  const {
    map,
    setUserLocationMarker,
    setGpsWatchId,
    setIsTrackingLocation,
  } = useMapStore();
  const { openAlert } = useAlertStore();

  const [gpsState, setGpsState] = useState<GpsState>("idle");
  const hasReceivedFirstLocation = useRef(false);

  // Get compass heading (works even when stationary)
  const compassHeading = useCompass();

  // Create or update user location marker
  const updateUserLocationMarker = useCallback(
    (lat: number, lng: number, heading?: number | null) => {
      if (!map) return;

      // Get current marker from store to avoid stale closure
      const currentMarker = useMapStore.getState().userLocationMarker;

      // Remove existing marker
      if (currentMarker) {
        currentMarker.setMap(null);
      }

      // Create new marker at new position with optional heading
      const newMarker = createUserLocationMarker(map, lat, lng, heading);
      setUserLocationMarker(newMarker);
    },
    [map, setUserLocationMarker]
  );

  const handleGps = useCallback(() => {
    // Prevent multiple simultaneous requests
    if (gpsState === "locating") return;

    // Desktop uses getCurrentPosition (one-time)
    // All mobile devices (app + web) use watchPosition (continuous)
    const isMobile = deviceType !== "desktop";

    // Check if already tracking (prevent duplicate sessions)
    const currentWatchId = useMapStore.getState().gpsWatchId;
    if (currentWatchId !== null && isMobile) {
      // Already tracking, just re-center map
      if (map && myLocation) {
        const latLng = new window.kakao.maps.LatLng(
          myLocation.lat,
          myLocation.lng
        );
        map.setCenter(latLng);
        onSuccess?.("현재 위치로 이동했습니다");
      }
      return;
    }

    setGpsState("locating");
    hasReceivedFirstLocation.current = false;

    // Handle React Native WebView
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("gps-permission");
      if (myLocation && map) {
        const latLng = new window.kakao.maps.LatLng(
          myLocation.lat,
          myLocation.lng
        );
        setCurLocation({ lat: myLocation.lat, lng: myLocation.lng });
        map.setCenter(latLng);
        updateUserLocationMarker(myLocation.lat, myLocation.lng);
        setGpsState("success");
        onSuccess?.("현재 위치로 이동했습니다");

        setTimeout(() => setGpsState("idle"), 2000);
      } else {
        setGpsState("idle");
      }
      return;
    }

    // If location already cached, just center map (desktop only)
    if (map && myLocation && !isMobile) {
      const latLng = new window.kakao.maps.LatLng(
        myLocation.lat,
        myLocation.lng
      );
      setCurLocation({ lat: myLocation.lat, lng: myLocation.lng });
      map.setCenter(latLng);
      updateUserLocationMarker(myLocation.lat, myLocation.lng);
      setGpsState("success");
      onSuccess?.("현재 위치로 이동했습니다");

      setTimeout(() => setGpsState("idle"), 2000);
      return;
    }

    // Get fresh location
    if (!navigator.geolocation) {
      setGeoLocationError("위치 정보 제공 안됨");
      setGpsState("error");
      onError?.("위치 서비스를 지원하지 않는 브라우저입니다");
      setTimeout(() => setGpsState("idle"), 2000);
      return;
    }

    // For PC: one-time fetch
    if (!isMobile) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMyLocation(location);

          if (map) {
            const latLng = new window.kakao.maps.LatLng(
              location.lat,
              location.lng
            );
            setCurLocation(location);
            map.setCenter(latLng);
            updateUserLocationMarker(location.lat, location.lng);
          }

          setGpsState("success");
          onSuccess?.("현재 위치로 이동했습니다");

          setTimeout(() => setGpsState("idle"), 2000);
        },
        (error) => {
          console.error("GPS error:", error);
          setGpsState("error");
          onError?.("위치를 찾을 수 없습니다. 위치 권한을 확인해주세요.");
          setGeoLocationError("위치 정보 제공 안됨");
          setTimeout(() => setGpsState("idle"), 2000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    } else {
      // For Mobile: start continuous tracking
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Extract heading from GPS (available when moving)
          // heading: 0-360 degrees, where 0 = North, 90 = East, 180 = South, 270 = West
          // Returns null if device is stationary
          const gpsHeading = position.coords.heading;

          // Use GPS heading when moving, fallback to compass when stationary
          // GPS heading is more accurate when moving, compass works when stationary
          const heading = gpsHeading !== null ? gpsHeading : compassHeading;

          setMyLocation(location);

          if (map) {
            const latLng = new window.kakao.maps.LatLng(
              location.lat,
              location.lng
            );
            setCurLocation(location);

            // Only center map on first location or if tracking just started
            // Read from store to avoid stale closure
            if (!useMapStore.getState().isTrackingLocation) {
              map.setCenter(latLng);
              onSuccess?.("위치 추적이 시작되었습니다");
              setIsTrackingLocation(true);
            }

            // Update marker with heading (shows arrow from GPS or compass)
            updateUserLocationMarker(location.lat, location.lng, heading);
          }

          // Transition to success state only on first location update
          if (!hasReceivedFirstLocation.current) {
            hasReceivedFirstLocation.current = true;
            setGpsState("success");
            setTimeout(() => {
              setGpsState("idle");
            }, 2000);
          }
        },
        (error) => {
          console.error("GPS error:", error);
          setGpsState("error");

          if (
            deviceType === "ios-mobile-app" ||
            deviceType === "android-mobile-app"
          ) {
            openAlert({
              title: "위치 서비스 사용",
              description:
                '위치 서비스를 사용할 수 없습니다. "기기의 설정 > 개인 정보 보호" 에서 위치서비스를 켜주세요.',
              onClick: () => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage("open-settings");
                }
              },
              cancel: true,
              buttonLabel: "설정 가기",
            });
          } else {
            onError?.("위치를 찾을 수 없습니다. 위치 권한을 확인해주세요.");
          }

          setGeoLocationError("위치 정보 제공 안됨");
          setTimeout(() => setGpsState("idle"), 2000);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Always get fresh location for mobile
        }
      );

      setGpsWatchId(watchId);
    }
  }, [
    gpsState,
    myLocation,
    map,
    deviceType,
    setCurLocation,
    setMyLocation,
    setGeoLocationError,
    openAlert,
    onSuccess,
    onError,
    updateUserLocationMarker,
    setGpsWatchId,
    setIsTrackingLocation,
  ]);

  // Update marker rotation when compass heading changes (stationary device)
  useEffect(() => {
    // Only update if we're tracking and have a location
    const { isTrackingLocation } = useMapStore.getState();
    if (isTrackingLocation && myLocation && map && compassHeading !== null) {
      // Check if GPS heading is unavailable (device is stationary)
      // If so, update marker with compass heading
      updateUserLocationMarker(myLocation.lat, myLocation.lng, compassHeading);
    }
  }, [compassHeading, myLocation, map, updateUserLocationMarker]);

  // Cleanup: Stop tracking location when component unmounts
  useEffect(() => {
    return () => {
      const currentWatchId = useMapStore.getState().gpsWatchId;
      const currentMarker = useMapStore.getState().userLocationMarker;

      if (currentWatchId !== null) {
        navigator.geolocation.clearWatch(currentWatchId);
        setGpsWatchId(null);
      }

      if (currentMarker) {
        currentMarker.setMap(null);
        setUserLocationMarker(null);
      }

      setIsTrackingLocation(false);
    };
  }, [setGpsWatchId, setUserLocationMarker, setIsTrackingLocation]);

  return {
    gpsState,
    handleGps,
  };
};

export default useGpsTracking;
