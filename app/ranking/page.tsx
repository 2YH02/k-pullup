import markerRanking from "@api/marker/marker-ranking";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import RankingClient from "./ranking-client";

const RankingPage = async () => {
  const rankingData = await markerRanking();
  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="많이 찾는 위치"
      hasBackButton
      withNav
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <RankingClient data={rankingData} />
    </SideMain>
  );
};

export default RankingPage;
