const updateUserName = async (name: string) => {
  const response = await fetch(`/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name }),
  });

  return response;
};

export default updateUserName;
