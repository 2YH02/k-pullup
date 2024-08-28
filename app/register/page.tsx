import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import RegisterClient from "./register-client";

const Register = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <>
      <RegisterClient referrer={!!referrer} deviceType={deviceType} />
    </>
  );
};

export default Register;
