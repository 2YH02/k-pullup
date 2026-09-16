import {
  cacheRoadviewDate,
  getCachedRoadviewDate,
} from "@lib/cache/roadview-date-cache";
import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface RoadviewDateRes {
  shot_date: string;
}

const getRoadviewDate = async (
  lat: number,
  lng: number
): Promise<RoadviewDateRes | null> => {
  // Check cache first (client-side only)
  const cached = getCachedRoadviewDate(lat, lng);
  if (cached) {
    return { shot_date: cached };
  }

  const url = getApiBase();

  try {
    const response = await fetchData(
      `${url}/markers/roadview-date?latitude=${lat}&longitude=${lng}`
    );

    if (!response.ok) {
      return null;
    }

    const data: RoadviewDateRes = await response.json();

    // Cache successful response
    if (data.shot_date) {
      cacheRoadviewDate(lat, lng, data.shot_date);
    }

    return data;
  } catch (error) {
    return null;
  }
};

export default getRoadviewDate;
