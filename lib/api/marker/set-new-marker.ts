import type { Marker } from "@/types/marker.types";

export interface SetMarkerReq {
  photos: File[];
  latitude: number;
  longitude: number;
  description: string;
}

export interface SetMarkerRes
  extends Omit<Marker, "photos" | "createdAt" | "updatedAt"> {
  photoUrls?: string[];
}

const setNewMarker = async (multipart: SetMarkerReq) => {
  const formData = new FormData();

  for (let i = 0; i < multipart.photos.length; i++) {
    formData.append("photos", multipart.photos[i]);
  }

  formData.append("latitude", multipart.latitude.toString());
  formData.append("longitude", multipart.longitude.toString());
  formData.append("description", multipart.description);

  const response = await fetch(`/api/v1/markers/new`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return response;
};

export default setNewMarker;
