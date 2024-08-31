import fetchData from "@lib/fetchData";

const sendPasswordResetEmail = async (email: string) => {
  const formData = new FormData();
  formData.append("email", email);

  const response = await fetchData(`/api/v1/auth/request-password-reset`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  return response;
};

export default sendPasswordResetEmail;
