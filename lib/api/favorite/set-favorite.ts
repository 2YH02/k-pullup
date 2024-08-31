import fetchData from "@lib/fetchData";

const setFavorite = async (id: number) => {
  const response = await fetchData(`/api/v1/markers/${id}/favorites`, {
    method: "POST",
    credentials: "include",
  });

  return response;
};

export default setFavorite;
