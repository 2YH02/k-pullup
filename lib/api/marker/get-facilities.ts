import type { Facilities } from "./set-new-facilities";

export interface FacilitiesRes extends Facilities {
  markerId: number;
}

const getFacilities = async (markerId: number): Promise<FacilitiesRes[]> => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetch(`${url}/markers/${markerId}/facilities`, {
    credentials: "include",
  });

  const data = await response.json();

  return data;
};

export default getFacilities;
