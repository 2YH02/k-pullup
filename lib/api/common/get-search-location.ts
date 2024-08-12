import { type LocationResponse } from "@/types/kakao-location.type";

const getSearchLoation = async (query: string): Promise<LocationResponse> => {
  const response = await fetch(
    `https://dapi.kakao.com/v2/local/search/address?query=${query}&page=1&size=9`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAK}`,
      },
    }
  );

  const data = await response.json();

  return data;
};

export default getSearchLoation;
