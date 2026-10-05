import { headers } from "next/headers";
import SignupClient from "./signup-client";
import getServerDeviceType from "@lib/get-server-device-type";

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

  const deviceType = getServerDeviceType();

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
