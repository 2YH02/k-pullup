import { Marker } from "@/types/marker.types";

export type MarkerRes = Pick<
  Marker,
  "markerId" | "latitude" | "longitude" | "address"
>;

const getAllMarker = async (): Promise<MarkerRes[]> => {
  const response = await fetch(`/api/v1/markers`);

  if (!response.ok) {
    return [];
  }

  const data: MarkerRes[] = await response.json();

  return data;
};

export default getAllMarker;
