"use client";

import type { Device } from "@/app/mypage/page";
import type { Nullable } from "@/types";
import getAllMarker from "@api/marker/get-all-marker";
import Tooltip from "@common/tooltip";
import useGpsTracking from "@hooks/useGpsTracking";
import useIsMounted from "@hooks/useIsMounted";
import { useToast } from "@hooks/useToast";
import LoadingIcon from "@icons/loading-icon";
import cn from "@lib/cn";
import useGeolocationStore from "@store/useGeolocationStore";
import useImageCountStore from "@store/useImageCountStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import useRoadviewStore from "@store/useRoadviewStore";
import { Loader2, Navigation } from "lucide-react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import MapContextMenu from "./map-context-menu";

const KakaoMap = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const isMounted = useIsMounted();
  const pathname = usePathname();

  const { setCurLocation, setMyLocation } = useGeolocationStore();
  const { map, setMap, setMapEl } = useMapStore();
  const { setMarker } = useMarkerStore();

  const { setCount } = useImageCountStore();

  const { openRoadview } = useRoadviewStore();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  // Use GPS tracking hook
  const { gpsState, handleGps } = useGpsTracking({
    deviceType,
    onError: (message) => toast({ description: message, variant: "destructive" }),
  });

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    lat: number;
    lng: number;
  } | null>(null);

  const mapRef = useRef<Nullable<HTMLDivElement>>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllMarker();

      const imageMarker = data.filter((marker) => {
        return !!marker.hasPhoto;
      });

      setCount(imageMarker.length);

      setMarker(data);
    };

    fetch();
  }, [setCount, setMarker]);

  useEffect(() => {
    if (!window.ReactNativeWebView || !map) return;
    const handleMessage = (e: any) => {
      const data = JSON.parse(e.data);

      if (data.latitude && data.longitude) {
        setMyLocation({ lat: data.latitude, lng: data.longitude });

        const latLng = new window.kakao.maps.LatLng(
          data.latitude,
          data.longitude
        );

        setCurLocation({ lat: data.latitude, lng: data.longitude });

        map.setCenter(latLng);
      }
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, [map, setMyLocation, setCurLocation]);

  useEffect(() => {
    if (!mapRef.current) return;

    setMapEl(mapRef.current);
  }, [setMapEl]);

  // Long-press event for mobile
  useEffect(() => {
    if (!map) return;

    const mapContainer = mapRef.current;
    if (!mapContainer) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Cancel if multi-touch (pinch zoom)
      if (e.touches.length > 1) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        return;
      }

      const touch = e.touches[0];

      // Store initial touch position
      touchStartPos.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      longPressTimer.current = setTimeout(() => {
        // Convert screen coordinates to map coordinates
        const x = touch.clientX;
        const y = touch.clientY;

        const projection = map.getProjection();
        const point = new window.kakao.maps.Point(x, y);
        const latLng = projection.coordsFromContainerPoint(point);

        setContextMenu({
          visible: true,
          x,
          y,
          lat: latLng.getLat(),
          lng: latLng.getLng(),
        });

        // Haptic feedback for mobile (if available)
        if (window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }, 500); // 500ms long-press threshold
    };

    const handleTouchEnd = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      touchStartPos.current = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Cancel if multi-touch (pinch zoom)
      if (e.touches.length > 1) {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
          touchStartPos.current = null;
        }
        return;
      }

      if (longPressTimer.current && touchStartPos.current) {
        const touch = e.touches[0];
        const moveDistance = Math.sqrt(
          Math.pow(touch.clientX - touchStartPos.current.x, 2) +
          Math.pow(touch.clientY - touchStartPos.current.y, 2)
        );

        // Cancel long-press if moved more than 10 pixels (indicates drag/pan intent)
        if (moveDistance > 10) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
          touchStartPos.current = null;
        }
      }
    };

    // Prevent default context menu on long-press
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };

    mapContainer.addEventListener("touchstart", handleTouchStart);
    mapContainer.addEventListener("touchend", handleTouchEnd);
    mapContainer.addEventListener("touchmove", handleTouchMove);
    mapContainer.addEventListener("contextmenu", handleContextMenu);

    return () => {
      mapContainer.removeEventListener("touchstart", handleTouchStart);
      mapContainer.removeEventListener("touchend", handleTouchEnd);
      mapContainer.removeEventListener("touchmove", handleTouchMove);
      mapContainer.removeEventListener("contextmenu", handleContextMenu);
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [map]);

  const handleLoadMap = useCallback(() => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.566535, 126.9779692),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      setMap(map);

      const handleCenterChange = () => {
        const latlng = map.getCenter();
        setCurLocation({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      };

      // Use 'idle' instead of 'dragend' to wait for animations/zoom to settle
      window.kakao.maps.event.addListener(map, "idle", handleCenterChange);

      // Right-click event for PC
      window.kakao.maps.event.addListener(
        map,
        "rightclick",
        (mouseEvent: any) => {
          const latLng = mouseEvent.latLng;
          const containerPoint = map.getProjection().containerPointFromCoords(latLng);

          setContextMenu({
            visible: true,
            x: containerPoint.x,
            y: containerPoint.y,
            lat: latLng.getLat(),
            lng: latLng.getLng(),
          });
        }
      );
    });
  }, [setMap, setCurLocation]);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleOpenRoadview = useCallback(() => {
    if (!contextMenu) return;

    openRoadview({
      lat: contextMenu.lat,
      lng: contextMenu.lng,
    });
  }, [contextMenu, openRoadview]);

  if (pathname === "/admin") return null;

  if (!isMounted) {
    return (
      <div className="relative w-dvw h-dvh bg-white dark:bg-black-light">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingIcon className="m-0" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_APP_KEY}&libraries=clusterer,services&autoload=false`}
        onLoad={handleLoadMap}
      />
      {loading && (
        <div className="z-60 absolute top-0 left-0 w-dvw h-dvh bg-[#ffffffb2] flex items-center justify-center">
          <div>
            <LoadingIcon className="m-0" />
          </div>
        </div>
      )}
      <div ref={mapRef} id="map" className="relative w-full h-dvh [touch-action:pan-x_pan-y] [-webkit-touch-callout:none] [-webkit-user-select:none] [user-select:none]">
        {/* GPS FAB for Desktop only */}
        <Tooltip
          as="button"
          title={gpsState === "locating" ? "위치 찾는 중..." : "내 위치"}
          className={cn(
            "absolute bottom-20 right-5 z-28",
            "w-14 h-14 rounded-full",
            "bg-white dark:bg-black-light",
            "border border-grey-light dark:border-grey-dark",
            "shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
            "flex items-center justify-center",
            "transition-all duration-300 ease-out",
            "mo:hidden",
            gpsState === "idle" && "hover:shadow-xl hover:scale-110 hover:border-primary dark:hover:border-primary active:scale-95",
            gpsState === "locating" && "cursor-wait animate-pulse disabled:opacity-70",
            gpsState === "success" && "bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-110",
            gpsState === "error" && "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-shake"
          )}
          position="left"
          onClick={gpsState === "locating" ? undefined : handleGps}
        >
          {gpsState === "locating" ? (
            <Loader2 className="stroke-primary animate-spin" size={26} />
          ) : (
            <Navigation
              size={26}
              style={{
                fill: gpsState === "success"
                  ? "#22c55e"
                  : gpsState === "error"
                  ? "#ef4444"
                  : "#f9b4ab",
                stroke: gpsState === "success"
                  ? "#22c55e"
                  : gpsState === "error"
                  ? "#ef4444"
                  : "#f9b4ab",
                transition: "all 0.3s ease-out",
              }}
            />
          )}
        </Tooltip>
        {/* <MoveMapInput deviceType={deviceType} /> */}
      </div>

      {/* Context Menu for right-click / long-press */}
      {contextMenu?.visible && (
        <MapContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRoadview={handleOpenRoadview}
          onClose={handleCloseContextMenu}
        />
      )}
    </>
  );
};

export default KakaoMap;
