export interface MyInfo {
  userId: number;
  username: string;
  email: string;
  chulbong?: boolean;
  error?: string;
}

const myInfo = async (cookie?: string): Promise<MyInfo> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetch(`${url}/users/me`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
    credentials: "include",
  });

  const data = response.json();

  return data;
};

export default myInfo;
