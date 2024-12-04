import fetchData from "@lib/fetchData";

const deleteMoment = async (markerId: number, momentId: number) => {
  const response = await fetchData(
    `/api/v1/markers/${markerId}/stories/${momentId}`,
    {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    }
  );

  return response;
};

export default deleteMoment;
