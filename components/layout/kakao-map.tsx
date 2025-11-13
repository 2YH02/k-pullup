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
    onSuccess: (message) => toast({ description: message }),
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
      const touch = e.touches[0];

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
    };

    const handleTouchMove = () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    };

    mapContainer.addEventListener("touchstart", handleTouchStart);
    mapContainer.addEventListener("touchend", handleTouchEnd);
    mapContainer.addEventListener("touchmove", handleTouchMove);

    return () => {
      mapContainer.removeEventListener("touchstart", handleTouchStart);
      mapContainer.removeEventListener("touchend", handleTouchEnd);
      mapContainer.removeEventListener("touchmove", handleTouchMove);
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

      const handleDrag = () => {
        const latlng = map.getCenter();
        setCurLocation({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      };

      window.kakao.maps.event.addListener(map, "dragend", handleDrag);

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
        <div className="z-[60] absolute top-0 left-0 w-dvw h-dvh bg-[#ffffffb2] flex items-center justify-center">
          <div>
            <LoadingIcon className="m-0" />
          </div>
        </div>
      )}
      <div ref={mapRef} id="map" className="relative w-full h-dvh">
        {/* GPS FAB for Desktop only */}
        <Tooltip
          as="button"
          title={gpsState === "locating" ? "위치 찾는 중..." : "내 위치"}
          className={cn(
            "absolute bottom-20 right-5 z-[28]",
            "w-14 h-14 rounded-full",
            "bg-white dark:bg-black",
            "shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)]",
            "flex items-center justify-center",
            "transition-all duration-200",
            "mo:hidden",
            gpsState === "idle" && "hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] hover:dark:shadow-[0_6px_16px_rgba(255,255,255,0.15)] hover:scale-105",
            gpsState === "locating" && "cursor-wait",
            gpsState === "success" && "bg-green-50 dark:bg-green-900/20 scale-110",
            gpsState === "error" && "bg-red-50 dark:bg-red-900/20 animate-shake"
          )}
          position="left"
          onClick={handleGps}
        >
          {gpsState === "locating" ? (
            <Loader2 className="dark:stroke-white stroke-black animate-spin" size={24} />
          ) : (
            <Navigation
              className={cn(
                "dark:fill-white fill-black dark:stroke-white stroke-black",
                gpsState === "success" && "fill-green-600 stroke-green-600 dark:fill-green-400 dark:stroke-green-400",
                gpsState === "error" && "fill-red-600 stroke-red-600 dark:fill-red-400 dark:stroke-red-400"
              )}
              size={24}
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
