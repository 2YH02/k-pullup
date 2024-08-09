"use client";

import { KakaoMap } from "@/types/kakao-map.types";
import Button from "@common/button";
import { useToast } from "@hooks/useToast";
import MapWalker from "@lib/map-walker";
import useMapStore from "@store/useMapStore";
import useRoadviewStore from "@store/useRoadviewStore";
import { useEffect, useRef, useState } from "react";

const Roadview = () => {
  const { lat, lng, open, closeModal } = useRoadviewStore();
  const { map } = useMapStore();
  const { toast } = useToast();

  const [mapHover, setMapHover] = useState(false);
  const [mapData, setMapData] = useState<KakaoMap | null>(null);

  const roadviewContainer = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapWrapper = useRef<HTMLDivElement>(null);

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
  }, [map, open, lng, lat, toast]);

  useEffect(() => {
    if (!mapData) return;

    if (mapHover)
      mapData.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);
    else mapData.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
  }, [mapHover]);

  if (!open) return null;

  return (
    <div ref={mapWrapper}>
      <div
        ref={roadviewContainer}
        className="absolute top-0 left-0 w-full h-full z-50 mo:h-[calc(100%-220px)]"
      />

      <div
        ref={mapContainer}
        className="absolute bottom-5 left-5 z-50 w-80 h-52 rounded-sm mo:h-[220px] mo:w-full mo:bottom-0 mo:left-0"
        onMouseEnter={() => setMapHover(true)}
        onMouseLeave={() => setMapHover(false)}
      />

      <Button onClick={closeModal} className="absolute top-2 right-2 z-[99]">
        닫기
      </Button>
    </div>
  );
};

export default Roadview;
