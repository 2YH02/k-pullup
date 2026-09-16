import fetchData from "@lib/fetchData";
import { getApiBase } from "@lib/api-base";

export interface Moment {
  blurhash: string;
  username: string;
  caption: string;
  photoURL: string;
  createdAt: Date;
  expiresAt: Date;
  storyID: number;
  markerID: number;
  userID: number;
  address: string;
}

const getMomentForMarker = async (markerId: number) => {
  const url = getApiBase();

  const response = await fetchData(`${url}/markers/${markerId}/stories`);

  if (!response.ok) throw new Error("에러");

  const data = await response.json();

  return data;
};

export default getMomentForMarker;
