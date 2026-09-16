import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface RankingInfo {
  address: string;
  latitude: number;
  longitude: number;
  markerId: number;
}

const markerRanking = async (): Promise<RankingInfo[]> => {
  const response = await fetchData(
    `${getApiBase()}/markers/ranking`,
    {
      cache: "no-store",
    }
  );

  const data = response.json();

  return data;
};

export default markerRanking;
