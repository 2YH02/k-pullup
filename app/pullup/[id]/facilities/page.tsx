import { type Device } from "@/app/mypage/page";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import FacilitiesClient from "./facilities-client";
import NotFoud from "@/components/pages/pullup/not-foud";

const FacilitiesPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  if (!id) return <NotFoud />;

  return (
    <SideMain
      headerTitle="기구 개수 등록"
      hasBackButton
      withNav
      referrer={!!referrer}
      deviceType={deviceType}
      dragable={false}
    >
      <FacilitiesClient markerId={~~id} />
    </SideMain>
  );
};

export default FacilitiesPage;
