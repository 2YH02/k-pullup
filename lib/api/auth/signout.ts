import fetchData from "@lib/fetchData";

const signout = async () => {
  const response = await fetchData(`/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = response.json();

  return data;
};
export default signout;
