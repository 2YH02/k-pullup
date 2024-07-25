import markerRanking from "@api/marker/marker-ranking";
import SideMain from "@common/side-main";
import RankingClient from "./ranking-client";

const RankingPage = async () => {
  const rankingData = await markerRanking();

  return (
    <SideMain headerTitle="많이 찾는" withNav>
      <RankingClient data={rankingData} />
    </SideMain>
  );
};

export default RankingPage;
