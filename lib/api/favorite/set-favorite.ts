const setFavorite = async (id: number) => {
  const response = await fetch(`/api/v1/markers/${id}/favorites`, {
    method: "POST",
    credentials: "include",
  });

  return response;
};

export default setFavorite;
