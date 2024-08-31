import fetchData from "@lib/fetchData";

const deleteMarker = async (id: number) => {
  const response = await fetchData(`/api/v1/markers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteMarker;
