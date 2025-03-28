import ChatCarousel from "@/components/pages/home/chat-carousel";
import MomentList from "@/components/pages/home/moment-list";
import MarkerRankingList from "@/components/pages/social/marker-ranking-list";
import markerRanking from "@/lib/api/marker/marker-ranking";
import getAllMoment from "@/lib/api/moment/get-all-moment";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";

export const generateMetadata = () => {
  return {
    title: "지역 채팅 - 대한민국 철봉 지도",
    description: "지역별 채팅에 참여하세요!",
  };
};

const Social = async () => {
  const rankingData = await markerRanking();
  const moment = await getAllMoment();

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="소셜" withNav fullHeight deviceType={deviceType}>
      <Section className="pb-0">
        <MomentList data={moment || []} />
      </Section>
      <Section>
        <SectionTitle
          title="지역 채팅"
          subTitle="다른 사람들과 소통해보세요."
        />
        <ChatCarousel />
      </Section>
      <Section>
        <SectionTitle title="인기 많은 철봉" />
        <MarkerRankingList allRanking={rankingData} />
      </Section>
    </SideMain>
  );
};

export default Social;
