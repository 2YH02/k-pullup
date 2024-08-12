const updateDescription = async (desc: string, id: number) => {
  const formData = new FormData();

  formData.append("description", desc);

  const response = await fetch(`/api/v1/markers/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();

  return data;
};

export default updateDescription;
