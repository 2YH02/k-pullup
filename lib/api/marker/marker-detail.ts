import type { Marker } from "@/types/marker.types";
import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

const markerDetail = async ({
  id,
  cookie,
}: {
  id: number;
  cookie?: string;
}): Promise<Marker> => {
  const url = getApiBase();

  const response = await fetchData(`${url}/markers/${id}/details`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data: Marker = await response.json();

  return data;
};

export default markerDetail;
