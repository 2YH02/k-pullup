export interface ReportValue {
  markerId: number;
  latitude: number;
  longitude: number;
  newLatitude?: number;
  newLongitude?: number;
  photos: File[];
  description: string;
}

const reportMarker = async (multipart: ReportValue) => {
  const formData = new FormData();

  for (let i = 0; i < multipart.photos.length; i++) {
    formData.append("photos", multipart.photos[i]);
  }

  formData.append("markerId", multipart.markerId.toString());
  formData.append("latitude", multipart.latitude.toString());
  formData.append("longitude", multipart.longitude.toString());

  if (multipart.newLatitude && multipart.newLongitude) {
    formData.append("newLatitude", multipart.newLatitude.toString());
    formData.append("newLongitude", multipart.newLongitude.toString());
  }

  formData.append("description", multipart.description);

  const response = await fetch(`/api/v1/reports`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return response;
};

export default reportMarker;
