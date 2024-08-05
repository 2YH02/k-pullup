"use client";

import useMarkerControl from "@hooks/useMarkerControl";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { useEffect } from "react";

const LoadMarker = () => {
  const { marker } = useMarkerStore();
  const { map } = useMapStore();

  const { reloadMarkers } = useMarkerControl();

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      reloadMarkers({ map, options: { maxLevel: 6 } });
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [map, marker]);

  useEffect(() => {
    if (!map) return;
    reloadMarkers({ map, options: { maxLevel: 6 } });
  }, [marker]);

  return null;
};

export default LoadMarker;
