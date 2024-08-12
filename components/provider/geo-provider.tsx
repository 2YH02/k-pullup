"use client";

import type { CustomOverlay } from "@/types/custom-overlay.types";
import getAddress from "@api/common/get-address";
import MyLocateOverlay from "@layout/my-locate-overlay";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
// TODO: 위치 추적 지도 이동 오류 배포 후 확인 필요

interface GeoProviderProps {
  children: React.ReactNode;
}

const GeoProvider = ({ children }: GeoProviderProps) => {
  const {
    myLocation,
    curLocation,
    setRegion,
    setMyLocation,
    setCurLocation,
    setGeoLocationError,
  } = useGeolocationStore();
  const { map } = useMapStore();

  const [myLocateOverlay, setMyLocateOverlay] = useState<CustomOverlay | null>(
    null
  );

  useEffect(() => {
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
          setGeoLocationError("위치 정보 제공 안됨");
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setGeoLocationError("위치 정보 제공 안됨");
    }
  }, [setMyLocation, setGeoLocationError]);

  useEffect(() => {
    if (
      myLocation &&
      curLocation.lat === 37.566535 &&
      curLocation.lng === 126.9779692
    ) {
      setCurLocation({
        lat: myLocation.lat,
        lng: myLocation.lng,
      });
    }
  }, [myLocation]);

  useEffect(() => {
    if (!map || !myLocation) return;

    if (myLocateOverlay) {
      myLocateOverlay.setMap(null);
    }

    const moveLatLon = new window.kakao.maps.LatLng(
      myLocation.lat,
      myLocation.lng
    );

    const overlayDiv = document.createElement("div");
    const root = createRoot(overlayDiv);
    root.render(<MyLocateOverlay />);

    const customOverlay = new window.kakao.maps.CustomOverlay({
      position: moveLatLon,
      content: overlayDiv,
      zIndex: 10,
    });

    customOverlay.setMap(map);
    setMyLocateOverlay(customOverlay);
  }, [map, myLocation]);

  useEffect(() => {
    if (!curLocation) return;

    const fetchRegion = async () => {
      const response = await getAddress({
        lat: curLocation.lat,
        lng: curLocation.lng,
      });

      if (response.code === -2) {
        setGeoLocationError("위치 정보 없음");
        return;
      }

      setGeoLocationError(null);

      const {
        address_name,
        code,
        region_1depth_name,
        region_2depth_name,
        region_3depth_name,
        region_4depth_name,
        region_type,
      } = response.documents[0];

      setRegion({
        address_name,
        code,
        region_1depth_name,
        region_2depth_name,
        region_3depth_name,
        region_4depth_name,
        region_type,
      });
    };

    fetchRegion();
  }, [curLocation, setGeoLocationError, setRegion]);

  return <>{children}</>;
};

export default GeoProvider;
