"use client";

import useIsMounted from "@/hooks/useIsMounted";
import Script from "next/script";

const KakaoMap = () => {
  const isMounted = useIsMounted();

  const handleLoadMap = () => {
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);
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
      <div id="map" className="relative w-full h-dvh" />
    </>
  );
};

export default KakaoMap;
