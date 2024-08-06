const signout = async () => {
  const response = await fetch(`/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = response.json();

  return data;
};
export default signout;
