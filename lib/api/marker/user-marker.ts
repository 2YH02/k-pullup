import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface UserMarker {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address: string;
}

export interface UserMarkerRes {
  markers: UserMarker[];
  currentPage: number;
  totalPages: number;
  totalMarkers: number;
}

const userMarkers = async ({
  userName,
  page = 1,
  pageSize = 10,
  cookie,
}: {
  userName: string;
  page?: number;
  pageSize?: number;
  cookie?: string;
}): Promise<UserMarkerRes> => {
  const url = getApiBase();

  const response = await fetchData(
    `${url}/markers/user/${encodeURIComponent(userName)}?page=${page}&pageSize=${pageSize}`,
    {
      headers: {
        Cookie: cookie || "",
      },
      cache: "no-store",
      credentials: "include",
    }
  );

  const data = response.json();

  return data;
};

export default userMarkers;
