import type { User } from "@/types/user";
import fetchData from "@lib/fetchData";

export interface SigninReq {
  username: string;
  email: string;
  password: string;
}

export interface SigninRes extends Omit<User, "username"> {
  username?: string;
}

const signup = async (body: SigninReq) => {
  const response = await fetchData(`/api/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response;
};

export default signup;
