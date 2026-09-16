import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";
import type { Facilities } from "./set-new-facilities";

export interface FacilitiesRes extends Facilities {
  markerId: number;
}

const getFacilities = async (markerId: number): Promise<FacilitiesRes[]> => {
  const url = getApiBase();

  const response = await fetchData(`${url}/markers/${markerId}/facilities`, {
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default getFacilities;
