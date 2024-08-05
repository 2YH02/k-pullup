import { Pos } from "@/types/kakao-map.types";
import useMapStore from "@store/useMapStore";
import { useCallback } from "react";

const useMapControl = () => {
  const { map } = useMapStore();

  const move = useCallback(
    ({ lat, lng, latlng }: { lat?: number; lng?: number; latlng?: Pos }) => {
      if (!map) return;

      if (latlng) {
        map.panTo(latlng);
      } else {
        const moveLatLon = new window.kakao.maps.LatLng(lat, lng);

        map.panTo(moveLatLon);
      }
    },
    [map]
  );

  return { move };
};

export default useMapControl;
