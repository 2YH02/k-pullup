"use client";

import useMarkerControl from "@hooks/useMarkerControl";
import { findNearbyMarkers } from "@lib/find-nearby-markers";
import useMapStore from "@store/useMapStore";
import useMarkerStore from "@store/useMarkerStore";
import { useEffect } from "react";

const getDistance = (level: number) => {
  switch (true) {
    case level <= 3:
      return 1;
    case level <= 5:
      return 2;
    case level <= 7:
      return 4;
    case level <= 8:
      return 14;
    case level <= 9:
      return 21;
    case level <= 10:
      return 30;
    case level <= 11:
      return 40;
    default:
      return 120;
  }
};

const LoadMarker = () => {
  const { marker } = useMarkerStore();
  const { map, deleteAllMarker } = useMapStore();

  const { createMarker } = useMarkerControl();

  useEffect(() => {
    if (!map) return;

    const handleIdle = () => {
      deleteAllMarker();
      const position = map.getCenter();
      const level = map.getLevel();

      const distance = getDistance(level);

      const nearbyMarker = findNearbyMarkers({
        markers: marker,
        latitude: position.getLat(),
        longitude: position.getLng(),
        maxDistance: distance,
      });

      for (let i = 0; i < nearbyMarker.length; i++) {
        createMarker({
          map,
          options: {
            image: "active",
            markerId: nearbyMarker[i].markerId,
            position: new window.kakao.maps.LatLng(
              nearbyMarker[i].latitude,
              nearbyMarker[i].longitude
            ),
          },
        });
      }

    //   console.log(level);
    //   console.log(nearbyMarker);
    };

    window.kakao.maps.event.addListener(map, "idle", handleIdle);

    return () => {
      window.kakao.maps.event.removeListener(map, "idle", handleIdle);
    };
  }, [map, marker]);

  return null;
};

export default LoadMarker;
