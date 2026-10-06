import markerRanking, { type RankingInfo } from "@/lib/api/marker/marker-ranking";
import SideMain from "@common/side-main";
import Text from "@common/text";
import Around from "@pages/moments/around";
import Hot from "@pages/moments/hot";
import getServerDeviceType from "@lib/get-server-device-type";

const MomentsPage = async () => {
  const deviceType = getServerDeviceType();
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
      <div className="px-6 pb-4 pt-5">
        <div className="rounded-2xl border border-primary/15 bg-search-input-bg/45 px-4 py-4 dark:border-white/10 dark:bg-black/30">
          <Text
            fontWeight="bold"
            display="block"
            className="text-text-on-surface dark:text-grey-light"
          >
            모먼트를 남길 장소를 찾아보세요
          </Text>
          <Text typography="t6" display="block" className="mt-1 text-text-on-surface-muted dark:text-grey">
            내 주변이나 인기 철봉에서 새로운 기록을 시작할 수 있어요.
          </Text>
        </div>
      </div>

      <Around />

      <Hot data={rankingData.slice(0, 3)} />

      {/* <MomentsGallery /> */}
    </SideMain>
  );
};

export default MomentsPage;
