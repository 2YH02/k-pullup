"use client";

import type { CustomOverlay } from "@/types/custom-overlay.types";
import getAddress from "@api/common/get-address";
import MyLocateOverlay from "@layout/my-locate-overlay";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setCurLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
          setGeoLocationError("위치 정보 제공 안됨");
        }
      );
    } else {
      setGeoLocationError("위치 정보 제공 안됨");
    }
  }, [setMyLocation, setCurLocation, setGeoLocationError]);

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

    map.setCenter(moveLatLon);
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
