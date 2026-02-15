import { type Device } from "@/app/mypage/page";
import getMomentForMarker from "@api/moment/get-moment-for-marker";
import getDeviceType from "@lib/get-device-type";
import NotFound from "@layout/not-found";
import { headers } from "next/headers";
import MomentClient from "./moment-client";

const MomentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  if (!id) {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="해당 위치를 찾을 수 없습니다."
      />
    );
  }

  try {
    const data = await getMomentForMarker(~~id);
    return (
      <MomentClient deviceType={deviceType} markerId={~~id} data={data || []} />
    );
  } catch {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="모먼트 정보를 불러오지 못했습니다."
      />
    );
  }
};

export default MomentPage;
