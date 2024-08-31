import fetchData from "@lib/fetchData";

export interface RankingInfo {
  address: string;
  latitude: number;
  longitude: number;
  markerId: number;
}

const markerRanking = async (): Promise<RankingInfo[]> => {
  const response = await fetchData(
    `${process.env.NEXT_PUBLIC_BASE_URL}/markers/ranking`,
    {
      cache: "no-store",
    }
  );

  const data = response.json();

  return data;
};

export default markerRanking;
