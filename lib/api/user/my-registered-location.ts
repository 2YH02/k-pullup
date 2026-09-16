import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface RegisteredMarker {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address?: string;
}

export interface RegisteredMarkerRes {
  currentPage: number;
  markers: RegisteredMarker[];
  totalMarkers: number;
  totalPages: number;
  error?: string;
  message?: string;
}

const myRegisteredLocation = async ({
  pageParam,
  cookie,
}: {
  pageParam?: number;
  cookie?: string;
}): Promise<RegisteredMarkerRes> => {
  const url = getApiBase();
  const page = pageParam || 1;

  const response = await fetchData(`${url}/markers/my?page=${page}&pageSize=7`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data: RegisteredMarkerRes = await response.json();

  return data;
};

export default myRegisteredLocation;
