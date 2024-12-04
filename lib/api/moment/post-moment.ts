import fetchData from "@lib/fetchData";

const postMoment = async (body: {
  markerId: number;
  photo: File;
  caption: string;
}) => {
  const formData = new FormData();

  formData.append("caption", body.caption);
  formData.append("photo", body.photo);

  const response = await fetchData(`/api/v1/markers/${body.markerId}/stories`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    body: formData,
  });

  return response;
};

export default postMoment;
