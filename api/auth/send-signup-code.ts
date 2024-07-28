const sendSignupCode = async (email: string) => {
  const formData = new FormData();

  formData.append("email", email);

  const response = await fetch(`/api/v1/auth/verify-email/send`, {
    method: "POST",
    body: formData,
  });

  return response;
};

export default sendSignupCode;
