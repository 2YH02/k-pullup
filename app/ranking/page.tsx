import SideMain from "@common/side-main";
import RankingClient from "./ranking-client";

const RankingPage = () => {
  return (
    <SideMain headerTitle="많이 찾는" withNav>
      <RankingClient />
    </SideMain>
  );
};

export default RankingPage;
