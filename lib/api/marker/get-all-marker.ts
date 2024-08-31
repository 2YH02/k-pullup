import { Marker } from "@/types/marker.types";
import fetchData from "@lib/fetchData";

export type MarkerRes = Pick<
  Marker,
  "markerId" | "latitude" | "longitude" | "address" | "hasPhoto"
>;

const getAllMarker = async (): Promise<MarkerRes[]> => {
  const response = await fetchData(`/api/v1/markers`);

  if (!response.ok) {
    return [];
  }

  const data: MarkerRes[] = await response.json();

  return data;
};

export default getAllMarker;
