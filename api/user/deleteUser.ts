const deleteUser = async () => {
  const response = await fetch(`/api/v1/users/me`, {
    method: "DELETE",
    credentials: "include",
  });

  return response;
};

export default deleteUser;
