const deleteMarker = async (id: number) => {
  const response = await fetch(`/api/v1/markers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteMarker;
