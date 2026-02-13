"use client";

import useMarkerStore from "@/store/useMarkerStore";
import useMapControl from "@hooks/useMapControl";
import useMarkerControl from "@hooks/useMarkerControl";
import useMapStore from "@store/useMapStore";
import { useEffect } from "react";

const MoveMap = ({
  lat,
  lng,
  markerId,
}: {
  lat: number;
  lng: number;
  markerId: number;
}) => {
  const { move } = useMapControl();
  const map = useMapStore((state) => state.map);
  const setSelectedId = useMapStore((state) => state.setSelectedId);
  const marker = useMarkerStore((state) => state.marker);
  const { reloadMarkers } = useMarkerControl();

  useEffect(() => {
    if (!map) return;

    setSelectedId(markerId);
    move({ lat, lng });
  }, [lat, lng, map, markerId, move, setSelectedId]);

  useEffect(() => {
    if (!map || !marker) return;
    reloadMarkers({ map, options: { maxLevel: 6, selectId: markerId } });
  }, [map, marker, markerId, reloadMarkers]);

  return null;
};

export default MoveMap;
