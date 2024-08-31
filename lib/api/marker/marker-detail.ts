import type { Marker } from "@/types/marker.types";
import fetchData from "@lib/fetchData";

const markerDetail = async ({
  id,
  cookie,
}: {
  id: number;
  cookie?: string;
}): Promise<Marker> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

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
