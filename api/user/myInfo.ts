export interface MyInfo {
  userId: number;
  username: string;
  email: string;
  chulbong?: boolean;
  error?: string;
}

const myInfo = async (cookie: string): Promise<MyInfo> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
    headers: {
      Cookie: cookie || "",
    },
    cache: "no-store",
  });

  const data = response.json();

  return data;
};

export default myInfo;
