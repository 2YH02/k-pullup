import markerRanking from "@api/marker/marker-ranking";
import SideMain from "@common/side-main";
import { headers } from "next/headers";
import RankingClient from "./ranking-client";

const RankingPage = async () => {
  const rankingData = await markerRanking();
  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <SideMain
      headerTitle="많이 찾는 위치"
      hasBackButton
      withNav
      referrer={!!referrer}
    >
      <RankingClient data={rankingData} />
    </SideMain>
  );
};

export default RankingPage;
