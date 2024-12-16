import fetchData from "@lib/fetchData";

export interface Moment {
  blurhash:string;
  username: string;
  caption: string;
  photoURL: string;
  createdAt: Date;
  expiresAt: Date;
  storyID: number;
  markerID: number;
  userID: number;
}

const getMomentForMarker = async (markerId: number) => {
  const isServer = typeof window === "undefined";

  const url = isServer ? process.env.NEXT_PUBLIC_BASE_URL : "/api/v1";

  const response = await fetchData(`${url}/markers/${markerId}/stories`);

  if (!response.ok) throw new Error("에러");

  const data = await response.json();

  return data;
};

export default getMomentForMarker;
