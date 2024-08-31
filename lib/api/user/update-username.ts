import fetchData from "@lib/fetchData";

const updateUserName = async (name: string) => {
  const response = await fetchData(`/api/v1/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: name }),
  });

  return response;
};

export default updateUserName;
