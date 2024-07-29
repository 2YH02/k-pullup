export interface Favorite {
  latitude: number;
  longitude: number;
  markerId: number;
  description: string;
  address?: string;
}
// TODO: 모든 api 요청 함수 형식 favorites와 똑같이 바꾸기

const favorites = async (cookie?: string): Promise<Favorite[]> => {
  const response = await fetch(
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
    const errorData: { error: string } = await response.json();
    throw new Error(errorData.error || "Failed to fetch favorites");
  }

  const data: Favorite[] = await response.json();

  return data;
};

export default favorites;
