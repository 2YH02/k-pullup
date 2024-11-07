import { type Device } from "@/app/mypage/page";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import MomentClient from "./moment-client";

const MomentPage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);
  return <MomentClient deviceType={deviceType} />;
};

export default MomentPage;
