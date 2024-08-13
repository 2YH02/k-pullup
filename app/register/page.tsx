import { headers } from "next/headers";
import RegisterClient from "./register-client";

const Register = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <>
      <RegisterClient referrer={!!referrer} />
    </>
  );
};

export default Register;
