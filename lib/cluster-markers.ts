import type { MarkerRes } from "@api/marker/get-all-marker";

interface MarkerGroup {
  centerLatitude: number;
  centerLongitude: number;
  count: number;
}

const getGridCoordinates = (
  lat: number,
  lon: number,
  cellSize: number
): { x: number; y: number } => {
  const x = Math.floor(lon / cellSize);
  const y = Math.floor(lat / cellSize);
  return { x, y };
};

export const clusterMarkers = (
  markers: MarkerRes[],
  cellSize: number
): MarkerGroup[] => {
  const groups: { [key: string]: MarkerGroup } = {};

  markers.forEach((marker) => {
    const { x, y } = getGridCoordinates(
      marker.latitude,
      marker.longitude,
      cellSize
    );
    const key = `${x},${y}`;

    if (!groups[key]) {
      groups[key] = { centerLatitude: 0, centerLongitude: 0, count: 0 };
    }

    groups[key].centerLatitude += marker.latitude;
    groups[key].centerLongitude += marker.longitude;
    groups[key].count += 1;
  });

  return Object.values(groups).map((group) => ({
    centerLatitude: group.centerLatitude / group.count,
    centerLongitude: group.centerLongitude / group.count,
    count: group.count,
  }));
};
