import fetchData from "@lib/fetchData";
import type { RankingInfo } from "./marker-ranking";

const areaRanking = async (
  lat: number,
  lng: number
): Promise<RankingInfo[]> => {
  const response = await fetchData(
    `/api/v1/markers/area-ranking?latitude=${lat}&longitude=${lng}&limit=10`
  );

  const data = response.json();

  return data;
};

export default areaRanking;
