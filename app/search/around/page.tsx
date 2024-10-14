import { type Device } from "@/app/mypage/page";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import AroundClient from "./around-client";

const AroundPage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return <AroundClient deviceType={deviceType} />;
};

export default AroundPage;
