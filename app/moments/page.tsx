import markerRanking, { type RankingInfo } from "@/lib/api/marker/marker-ranking";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import Around from "@pages/moments/around";
import Hot from "@pages/moments/hot";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";

const MomentsPage = async () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);
  let rankingData: RankingInfo[] = [];

  try {
    const data = await markerRanking();
    rankingData = Array.isArray(data) ? data : [];
  } catch {
    rankingData = [];
  }

  return (
    <SideMain
      headerTitle="모먼트"
      fullHeight
      hasBackButton
      deviceType={deviceType}
    >
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl border border-location-badge-bg/85 bg-location-badge-bg/45 px-4 py-4 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/30">
          <Text
            fontWeight="bold"
            display="block"
            className="text-text-on-surface dark:text-grey-light"
          >
            지금 여기서 모먼트 올리기
          </Text>
          <Text typography="t6" display="block" className="mt-0.5 text-grey-dark dark:text-grey">
            인기 위치와 내 주변 위치에서 순간을 공유해보세요.
          </Text>
        </div>
      </div>

      <Hot data={rankingData.slice(0, 3)} />

      <Around />

      {/* <MomentsGallery /> */}
    </SideMain>
  );
};

export default MomentsPage;
