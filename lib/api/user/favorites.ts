import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface Favorite {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address?: string;
}

interface Response {
  data?: Favorite[];
  error?: string;
  message?: string;
}

const favorites = async (cookie?: string) => {
  const response = await fetchData(
    `${getApiBase()}/users/favorites`,
    {
      headers: {
        Cookie: cookie || "",
      },
      cache: "no-store",
      credentials: "include",
    }
  );

  // fetchData 가 non-2xx 에서 throw 하므로 여기 도달하면 항상 성공.
  const data: Response = {
    data: await response.json(),
  };

  return data;
};

export default favorites;
