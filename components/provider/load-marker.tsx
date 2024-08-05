"use client";

import useMarkerControl from "@hooks/useMarkerControl";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const LoadMarker = () => {
  const pathname = usePathname();

  const { marker } = useMarkerStore();
  const { map, selectedId } = useMapStore();

  const { reloadMarkers } = useMarkerControl();

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      if (selectedId) {
        reloadMarkers({ map, options: { maxLevel: 6, selectId: selectedId } });
      } else {
        reloadMarkers({ map, options: { maxLevel: 6 } });
      }
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [map, marker, selectedId]);

  useEffect(() => {
    if (!map || !!pathname.startsWith("/pullup")) return;

    reloadMarkers({ map, options: { maxLevel: 6 } });
  }, [marker, pathname]);

  return null;
};

export default LoadMarker;
