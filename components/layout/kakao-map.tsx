"use client";

import useIsMounted from "@hooks/useIsMounted";
import LoadingIcon from "@icons/loading-icon";
import getAllMarker, { type MarkerRes } from "@lib/api/marker/get-all-marker";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

const KakaoMap = () => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const { setCurLocation } = useGeolocationStore();
  const { map, setMap, setMarkers } = useMapStore();

  const [markerLoading, setMarkerLoading] = useState(false);

  useEffect(() => {
    const loadMarker = async (data: MarkerRes[]) => {
      const positions = data.map((marker) => {
        return {
          title: marker.markerId,
          latlng: new window.kakao.maps.LatLng(
            marker.latitude,
            marker.longitude
          ),
        };
      });

      const imageSize = new window.kakao.maps.Size(39, 39);
      const imageOption = { offset: new window.kakao.maps.Point(27, 45) };

      const pin = new window.kakao.maps.MarkerImage(
        "/pin-active.svg",
        imageSize,
        imageOption
      );

      const markers = positions.map((position) => {
        const marker = new window.kakao.maps.Marker({
          map: map,
          position: position.latlng,
          title: position.title,
          image: pin,
          clickable: true,
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          router.push(`/pullup/${position.title}`);
        });

        return marker;
      });

      return markers;
    };

    const fetch = async () => {
      if (!map) return;
      setMarkerLoading(true);
      const data = await getAllMarker();

      const newMarkers = await loadMarker(data);
      setMarkers(newMarkers);
      setMarkerLoading(false);
    };

    fetch();
  }, [map]);

  const handleLoadMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
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
    });
  };

  if (!isMounted) {
    // TODO: 지도 로딩 ui 만들기
    return <div className="relative w-dvw h-dvh bg-red" />;
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_APP_KEY}&libraries=clusterer,services&autoload=false`}
        onLoad={handleLoadMap}
      />
      {markerLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-u-1/2 z-[1000]">
          <LoadingIcon className="m-0" size="lg" />
        </div>
      )}
      <div id="map" className="relative w-full h-dvh" />
    </>
  );
};

export default KakaoMap;
