import Ads from "@/components/common/ads";
import Section from "@common/section";
import SideMain from "@common/side-main";
import ChallengeClient from "@pages/challenge/challenge-client";
import getServerDeviceType from "@lib/get-server-device-type";

export const generateMetadata = () => {
  return {
    title: "챌린지 - 대한민국 철봉 지도",
    description: "방문 스트릭과 주간 목표를 확인하세요.",
  };
};

const ChallengePage = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="챌린지" withNav fullHeight deviceType={deviceType}>
      <div className="page-transition">
        <ChallengeClient />
        <Ads type="feed" />
      </div>
    </SideMain>
  );
};

export default ChallengePage;
