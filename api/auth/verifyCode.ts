const verifyCode = async ({ email, code }: { email: string; code: string }) => {
  const formData = new FormData();

  formData.append("email", email);
  formData.append("token", code);

  const response = await fetch(`/api/v1/auth/verify-email/confirm`, {
    method: "POST",
    body: formData,
  });

  return response;
};

export default verifyCode;
