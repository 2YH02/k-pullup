"use client";

import { useAddressResolver } from "@hooks/useAddressResolver";
import useGeolocationStore from "@store/useGeolocationStore";
import useMapStore from "@store/useMapStore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface GeoProviderProps {
  children: React.ReactNode;
}

const GeoProvider = ({ children }: GeoProviderProps) => {
  const {
    myLocation,
    curLocation,
    setRegion,
    setRegionLoading,
    setMyLocation,
    setCurLocation,
    setGeoLocationError,
  } = useGeolocationStore();
  const pathname = usePathname();

  const { map } = useMapStore();
  const { resolve } = useAddressResolver();

  const [locationMove, setLocationMove] = useState(true);

  useEffect(() => {
    const setPosition = (position: GeolocationPosition) => {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage("gps-permission");
      const handleMessage = (e: any) => {
        const data = JSON.parse(e.data);

        if (data.latitude && data.longitude) {
          setMyLocation({ lat: data.latitude, lng: data.longitude });
        }
      };

      window.addEventListener("message", handleMessage);
      document.addEventListener("message", handleMessage);

      return () => {
        window.removeEventListener("message", handleMessage);
        document.removeEventListener("message", handleMessage);
      };
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition(position);
          },
          (err) => {
            console.error(err);
            setGeoLocationError("위치 정보 제공 안됨");
          }
        );
      } else {
        setGeoLocationError("위치 정보 제공 안됨");
      }
    }
  }, [setMyLocation, setGeoLocationError]);

  useEffect(() => {
    if (!map) return;
    if (myLocation && locationMove) {
      const moveLatLon = new window.kakao.maps.LatLng(
        myLocation.lat,
        myLocation.lng
      );

      setCurLocation({
        lat: myLocation.lat,
        lng: myLocation.lng,
      });

      if (!pathname.startsWith("/pullup")) {
        map.setCenter(moveLatLon);
        setLocationMove(false);
      }
    }
  }, [myLocation, map, locationMove, setCurLocation, pathname]);

  useEffect(() => {
    if (!curLocation) return;

    const fetchRegion = async () => {
      setRegionLoading(true);

      const result = await resolve(curLocation.lat, curLocation.lng);

      if (!result.success) {
        setGeoLocationError(result.error || "위치 정보 없음");
        setRegionLoading(false);
        return;
      }

      if (result.data) {
        setGeoLocationError(null);
        setRegion({
          address_name: result.data.address_name,
          code: result.data.code,
          region_1depth_name: result.data.region_1depth_name,
          region_2depth_name: result.data.region_2depth_name,
          region_3depth_name: result.data.region_3depth_name,
          region_4depth_name: result.data.region_4depth_name,
          region_type: result.data.region_type,
        });
      }

      setRegionLoading(false);
    };

    fetchRegion();
  }, [curLocation, resolve, setGeoLocationError, setRegion, setRegionLoading]);

  return <>{children}</>;
};

export default GeoProvider;
