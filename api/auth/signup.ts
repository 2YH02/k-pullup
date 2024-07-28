import type { User } from "@/types/user";

export interface SigninReq {
  username: string;
  email: string;
  password: string;
}

export interface SigninRes extends Omit<User, "username"> {
  username?: string;
}

const signup = async (body: SigninReq) => {
  const response = await fetch(`/api/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
};

export default signup;
