const deleteFavorite = async (id: number) => {
  const response = await fetch(`/api/v1/markers/${id}/favorites`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteFavorite;
