"use client";

import getAllMarker from "@api/marker/get-all-marker";
import useIsMounted from "@hooks/useIsMounted";
import LoadingIcon from "@icons/loading-icon";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { LocateFixedIcon } from "lucide-react";
import Script from "next/script";
import { useEffect } from "react";
// TODO: 지도 우클릭 기능 추가 (리스트 메뉴 형식, ex-로드뷰)

const KakaoMap = () => {
  const isMounted = useIsMounted();

  const { setCurLocation, myLocation } = useGeolocationStore();
  const { map, setMap } = useMapStore();
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

  const handleGps = () => {
    if (!map || !myLocation) return;

    const latLng = new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng);

    setCurLocation({ lat: myLocation.lat, lng: myLocation.lng });

    map.setCenter(latLng);
  };

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
      <div id="map" className="relative w-full h-dvh">
        <button
          className="absolute top-5 right-5 p-1 rounded-md z-[2] mo:top-16
          bg-white shadow-simple dark:bg-black hover:bg-grey-light hover:dark:bg-grey-dark"
          onClick={handleGps}
        >
          <LocateFixedIcon className="dark:stroke-white" />
        </button>
      </div>
    </>
  );
};

export default KakaoMap;
