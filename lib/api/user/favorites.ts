import fetchData from "@lib/fetchData";

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
    `${process.env.NEXT_PUBLIC_BASE_URL}/users/favorites`,
    {
      headers: {
        Cookie: cookie || "",
      },
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const msg = await response.json();
    if (response.status === 401) {
      const data: Response = {
        error: msg.error,
      };
      return data;
    } else {
      const data: Response = {
        error: msg.message,
      };
      return data;
    }
  }

  const data: Response = {
    data: await response.json(),
  };

  return data;
};

export default favorites;
