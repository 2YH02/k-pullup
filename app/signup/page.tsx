import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import SignupClient from "./signup-client";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

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
