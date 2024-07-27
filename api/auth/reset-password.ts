interface Req {
  token: string;
  password: string;
}

const resetPassword = async ({ token, password }: Req) => {
  const formData = new FormData();

  formData.append("password", password);
  formData.append("token", token);

  const response = await fetch(`/api/v1/auth/reset-password`, {
    method: "POST",
    body: formData,
  });

  return response;
};

export default resetPassword;
