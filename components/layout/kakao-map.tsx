"use client";

import getAllMarker from "@api/marker/get-all-marker";
import useIsMounted from "@hooks/useIsMounted";
import LoadingIcon from "@icons/loading-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import Script from "next/script";
import { useEffect } from "react";

const KakaoMap = () => {
  const isMounted = useIsMounted();

  const { setCurLocation } = useGeolocationStore();
  const { setMap } = useMapStore();
  const { setMarker } = useMarkerStore();

  useEffect(() => {
    const fetch = async () => {
      const data = await getAllMarker();

      setMarker(data);
    };

    fetch();
  }, []);

  const handleLoadMap = () => {
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
    });
  };

  if (!isMounted) {
    return (
      <div className="relative w-dvw h-dvh bg-white dark:bg-black">
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
      <div id="map" className="relative w-full h-dvh" />
    </>
  );
};

export default KakaoMap;
