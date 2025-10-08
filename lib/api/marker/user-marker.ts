import fetchData from "@lib/fetchData";

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
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(
    `${url}/markers/user/${userName}?page=${page}&pageSize=${pageSize}`,
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
