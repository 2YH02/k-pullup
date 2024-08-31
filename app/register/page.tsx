import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import RegisterClient from "./register-client";

export const generateMetadata = () => {
  return {
    title: "위치 등록 - 대한민국 철봉 지도",
    description: "원하는 위치를 등록해보세요!",
  };
};

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
