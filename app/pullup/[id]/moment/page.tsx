import { type Device } from "@/app/mypage/page";
import getMomentForMarker from "@api/moment/get-moment-for-marker";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import MomentClient from "./moment-client";

const MomentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const data = await getMomentForMarker(6969);

  const deviceType: Device = getDeviceType(userAgent as string);
  return (
    <MomentClient deviceType={deviceType} markerId={~~id} data={data || []} />
  );
};

export default MomentPage;
