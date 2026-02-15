import { type Device } from "@/app/mypage/page";
import NotFound from "@layout/not-found";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import FacilitiesClient from "./facilities-client";

const FacilitiesPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  if (!id) {
    return (
      <NotFound
        hasBackButton
        headerTitle="기구 개수 등록"
        errorTitle="해당 위치를 찾을 수 없습니다."
      />
    );
  }

  return (
    <SideMain
      headerTitle="기구 개수 등록"
      hasBackButton
      withNav
      referrer={!!referrer}
      deviceType={deviceType}
      dragable={false}
      bodyStyle="pb-0"
    >
      <FacilitiesClient markerId={~~id} />
    </SideMain>
  );
};

export default FacilitiesPage;
