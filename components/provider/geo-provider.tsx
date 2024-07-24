"use client";

import getAddress from "@/api/common/get-address";
import useGeolocationStore from "@store/useGeolocationStore";
import { useEffect } from "react";

interface GeoProviderProps {
  children: React.ReactNode;
}

const GeoProvider = ({ children }: GeoProviderProps) => {
  const {
    curLocation,
    setRegion,
    setMyLocation,
    setCurLocation,
    setGeoLocationError,
  } = useGeolocationStore();

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
  }, []);

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
  }, [curLocation]);

  return <>{children}</>;
};

export default GeoProvider;
