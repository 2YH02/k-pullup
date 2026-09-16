import type { MarkerRes } from "@api/marker/get-all-marker";
import { haversineDistanceKm } from "@lib/geo-utils";

export const findNearbyMarkers = ({
  markers,
  latitude,
  longitude,
  maxDistance,
}: {
  markers: MarkerRes[];
  latitude: number;
  longitude: number;
  maxDistance: number;
}): MarkerRes[] => {
  return markers.filter((marker) => {
    const distance = haversineDistanceKm(
      latitude,
      longitude,
      marker.latitude,
      marker.longitude
    );
    return distance <= maxDistance;
  });
};
