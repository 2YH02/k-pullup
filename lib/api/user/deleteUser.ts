import fetchData from "@lib/fetchData";

const deleteUser = async () => {
  const response = await fetchData(`/api/v1/users/me`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteUser;
