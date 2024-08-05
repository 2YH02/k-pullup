"use client";

import useMapControl from "@hooks/useMapControl";
import useMapStore from "@store/useMapStore";
import { useEffect } from "react";

const MoveMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const { move } = useMapControl();
  const { map } = useMapStore();

  useEffect(() => {
    if (!map) return;
    move({ lat, lng });
  }, [map, lat, lng]);

  return null;
};

export default MoveMap;
