import fetchData from "@lib/fetchData";

const deleteFavorite = async (id: number) => {
  const response = await fetchData(`/api/v1/markers/${id}/favorites`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteFavorite;
