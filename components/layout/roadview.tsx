"use client";

import { type Device } from "@/app/mypage/page";
import { KakaoMap } from "@/types/kakao-map.types";
import getRoadviewDate from "@api/marker/get-roadview-date";
import Button from "@common/button";
import { useToast } from "@hooks/useToast";
import MapWalker from "@lib/map-walker";
import useMapStore from "@store/useMapStore";
import useRoadviewStore from "@store/useRoadviewStore";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const formatRoadviewDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Roadview = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const pathname = usePathname();

  const { lat, lng, open, closeModal } = useRoadviewStore();
  const { map } = useMapStore();
  const { toast } = useToast();

  const [mapHover, setMapHover] = useState(false);
  const [mapData, setMapData] = useState<KakaoMap | null>(null);
  const [roadviewDate, setRoadviewDate] = useState<string | null>(null);
  const [showDate, setShowDate] = useState(false);

  const roadviewContainer = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapWrapper = useRef<HTMLDivElement>(null);
  const dateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map || !open || !lat || !lng) return;
    if (!mapContainer.current || !roadviewContainer.current) return;

    const mapCenter = new window.kakao.maps.LatLng(lat, lng);
    const mapOption = {
      center: mapCenter,
      level: 3,
    };

    const miniMap = new window.kakao.maps.Map(mapContainer.current, mapOption);
    setMapData(miniMap);

    const imageSize = new window.kakao.maps.Size(39, 39);
    const imageOption = { offset: new window.kakao.maps.Point(27, 45) };

    const pin = new window.kakao.maps.MarkerImage(
      "/pin-active.svg",
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
      image: pin,
    });

    marker.setMap(miniMap);

    const roadview = new window.kakao.maps.Roadview(roadviewContainer.current);
    const roadviewClient = new window.kakao.maps.RoadviewClient();

    const position = new window.kakao.maps.LatLng(lat, lng);

    roadviewClient.getNearestPanoId(position, 50, (panoId: number) => {
      if (panoId === null) {
        toast({ description: "로드뷰를 지원하지 않는 주소입니다." });
        closeModal();
      } else {
        roadview.setPanoId(panoId, position);
      }
    });

    let mapWalker: any = null;

    window.kakao.maps.event.addListener(roadview, "init", () => {
      // 로드뷰에 마커 표시
      const rMarker = new window.kakao.maps.Marker({
        position: mapCenter,
        map: roadview,
      });

      const projection = roadview.getProjection();

      const viewpoint = projection.viewpointFromCoords(
        rMarker.getPosition(),
        rMarker.getAltitude()
      );
      roadview.setViewpoint(viewpoint);

      // 맵 워커 생성, 상태 변경
      mapWalker = new MapWalker(
        mapCenter,
        miniMap,
        mapWrapper.current as HTMLDivElement,
        roadviewContainer.current as HTMLDivElement,
        roadview,
        roadviewClient,
        mapContainer.current as HTMLDivElement
      );
      mapWalker.setMap();
      mapWalker.init();

      window.kakao.maps.event.addListener(roadview, "viewpoint_changed", () => {
        const viewpoint = roadview.getViewpoint();
        mapWalker.setAngle(viewpoint.pan);
      });

      window.kakao.maps.event.addListener(roadview, "position_changed", () => {
        const position = roadview.getPosition();
        mapWalker.setPosition(position);
        miniMap.setCenter(position);
      });
    });
  }, [map, open, lng, lat, toast, closeModal]);

  useEffect(() => {
    if (!mapData) return;

    if (mapHover)
      mapData.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    else mapData.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
  }, [mapHover, mapData]);

  // Fetch and display roadview date for 5 seconds
  useEffect(() => {
    if (!open || !lat || !lng) {
      // Clear date when roadview closes
      setRoadviewDate(null);
      setShowDate(false);
      if (dateTimerRef.current) {
        clearTimeout(dateTimerRef.current);
        dateTimerRef.current = null;
      }
      return;
    }

    const fetchDate = async () => {
      const result = await getRoadviewDate(lat, lng);

      if (result?.shot_date) {
        setRoadviewDate(result.shot_date);
        setShowDate(true);

        // Hide after 10 seconds
        dateTimerRef.current = setTimeout(() => {
          setShowDate(false);
        }, 10000);
      }
    };

    fetchDate();

    return () => {
      if (dateTimerRef.current) {
        clearTimeout(dateTimerRef.current);
        dateTimerRef.current = null;
      }
    };
  }, [open, lat, lng]);

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  if (!open || pathname === "/admin") return null;

  return (
    <div ref={mapWrapper}>
      <div
        ref={roadviewContainer}
        className="absolute top-0 left-0 w-full h-full z-50 mo:h-[calc(100%-220px)]"
      />

      <div
        ref={mapContainer}
        className="absolute bottom-5 left-5 z-50 w-80 h-52 rounded-xs mo:h-55 mo:w-full mo:bottom-0 mo:left-0"
        onMouseEnter={() => setMapHover(true)}
        onMouseLeave={() => setMapHover(false)}
      />

      <Button
        onClick={closeModal}
        className={`absolute ${
          isMobileApp ? "top-14" : "top-2"
        } right-2 z-99`}
      >
        닫기
      </Button>

      {/* Roadview Date Badge */}
      {showDate && roadviewDate && (
        <div
          className={`absolute ${
            isMobileApp ? "top-14" : "top-2"
          } left-2 z-99 bg-black/80 dark:bg-white/80 text-white dark:text-black px-3 py-2 rounded-lg shadow-lg backdrop-blur-xs transition-opacity duration-300`}
        >
          <span className="text-sm font-medium">
            로드뷰 날짜: {formatRoadviewDate(roadviewDate)}
          </span>
        </div>
      )}
    </div>
  );
};

export default Roadview;
