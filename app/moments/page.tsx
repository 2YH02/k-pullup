import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import Around from "@pages/moments/around";
import Hot from "@pages/moments/hot";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import markerRanking from "@/lib/api/marker/marker-ranking";

const MomentsPage = async () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const rankingData = await markerRanking();

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="모먼트"
      fullHeight
      hasBackButton
      deviceType={deviceType}
    >
      <div className="text-center pt-6 pb-3">
        <Text fontWeight="bold">✨ 지금 여기서 모먼트 올리기 ✨</Text>
      </div>

      <Hot data={rankingData ? rankingData.slice(0, 3) : []} />

      <Around />

      {/* <MomentsGallery /> */}
    </SideMain>
  );
};

export default MomentsPage;
