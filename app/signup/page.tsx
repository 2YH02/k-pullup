import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import SignupClient from "./signup-client";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "회원가입 - 대한민국 철봉 지도",
    description: "회원가입 후 철봉 위치를 확인하고, 등록해보세요!",
  };
};

const SignupPage = ({ searchParams }: PageProps) => {
  const { returnUrl } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <>
      <SignupClient
        returnUrl={returnUrl}
        referrer={!!referrer}
        deviceType={deviceType}
      />
    </>
  );
};

export default SignupPage;
