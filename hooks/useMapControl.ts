import useMapStore from "@store/useMapStore";
import { useCallback } from "react";

const useMapControl = () => {
  const { map } = useMapStore();

  const move = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      if (!map) return;

      const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

      map.panTo(moveLatLon);
    },
    [map]
  );

  return { move };
};

export default useMapControl;
