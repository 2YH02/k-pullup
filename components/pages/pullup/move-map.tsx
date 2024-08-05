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
  const { map, setSelectedId } = useMapStore();
  const { marker } = useMarkerStore();
  const { reloadMarkers } = useMarkerControl();

  useEffect(() => {
    if (!map) return;

    setSelectedId(markerId);
    move({ lat, lng });
  }, [map, lat, lng]);

  useEffect(() => {
    if (!map || !marker) return;
    reloadMarkers({ map, options: { maxLevel: 6, selectId: markerId } });
  }, [marker]);

  return null;
};

export default MoveMap;
