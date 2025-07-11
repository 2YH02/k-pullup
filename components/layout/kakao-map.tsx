"use client";

import type { Device } from "@/app/mypage/page";
import type { Nullable } from "@/types";
import getAllMarker from "@api/marker/get-all-marker";
import Tooltip from "@common/tooltip";
import useIsMounted from "@hooks/useIsMounted";
import LoadingIcon from "@icons/loading-icon";
import cn from "@lib/cn";
import useAlertStore from "@store/useAlertStore";
import useGeolocationStore from "@store/useGeolocationStore";
import useImageCountStore from "@store/useImageCountStore";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { LocateFixedIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
// TODO: 지도 우클릭 기능 추가 (리스트 메뉴 형식, ex-로드뷰)

const KakaoMap = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const isMounted = useIsMounted();
  const pathname = usePathname();

  const { myLocation, setCurLocation, setGeoLocationError, setMyLocation } =
    useGeolocationStore();
  const { map, setMap, setMapEl } = useMapStore();
  const { setMarker } = useMarkerStore();

  const { setCount } = useImageCountStore();

  const { openAlert } = useAlertStore();

  const [loading, setLoading] = useState(false);

  const mapRef = useRef<Nullable<HTMLDivElement>>(null);

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
  }, []);

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
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    setMapEl(mapRef.current);
  }, [mapRef.current]);

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
    setLoading(true);
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("gps-permission");
      if (myLocation && map) {
        const latLng = new window.kakao.maps.LatLng(
          myLocation.lat,
          myLocation.lng
        );

        setCurLocation({ lat: myLocation.lat, lng: myLocation.lng });

        map.setCenter(latLng);
      }

      setLoading(false);
      return;
    }
    if (!map || !myLocation) {
      const setPosition = (position: GeolocationPosition) => {
        setMyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      };

      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setPosition(position);
          },
          (err) => {
            console.error(err);
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
              openAlert({
                title: "위치 서비스 사용",
                description:
                  "위치 서비스를 사용할 수 없습니다. 브라우저 설정에서 위치서비스를 켜주세요.",
                onClick: () => {},
              });
            }
            setGeoLocationError("위치 정보 제공 안됨");
          }
        );
        setLoading(false);

        return () => {
          navigator.geolocation.clearWatch(watchId);
        };
      } else {
        setGeoLocationError("위치 정보 제공 안됨");
      }

      setLoading(false);
      return;
    }

    const latLng = new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng);

    setCurLocation({ lat: myLocation.lat, lng: myLocation.lng });

    map.setCenter(latLng);
    setLoading(false);
  };

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  const style = isMobileApp
    ? "mo:top-[100px] active:bg-grey-light active:dark:bg-grey-dark"
    : "hover:bg-grey-light hover:dark:bg-grey-dark";

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
        <Tooltip
          as="button"
          title="내 위치"
          className={cn(
            "absolute top-16 right-5 p-1 rounded-md z-[28] mo:z-[4] mo:top-16 bg-white shadow-simple dark:bg-black",
            style
          )}
          position="left"
          onClick={handleGps}
        >
          <LocateFixedIcon className="dark:stroke-white stroke-black" />
        </Tooltip>
        {/* <MoveMapInput deviceType={deviceType} /> */}
      </div>
    </>
  );
};

export default KakaoMap;
