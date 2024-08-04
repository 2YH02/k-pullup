import type { MarkerRes } from "@api/marker/get-all-marker";

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
    const distance = haversineDistance(
      latitude,
      longitude,
      marker.latitude,
      marker.longitude
    );
    return distance <= maxDistance;
  });
};
