import { headers } from "next/headers";
import RegisterClient from "./register-client";
import getServerDeviceType from "@lib/get-server-device-type";

export const generateMetadata = () => {
  return {
    title: "위치 등록 - 대한민국 철봉 지도",
    description: "원하는 위치를 등록해보세요!",
  };
};

const Register = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");

  const deviceType = getServerDeviceType();

  return <RegisterClient referrer={!!referrer} deviceType={deviceType} />;
};

export default Register;
