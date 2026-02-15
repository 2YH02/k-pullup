import markerRanking from "@api/marker/marker-ranking";
import getAllMoment from "@api/moment/get-all-moment";
import Footer from "@common/footer";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import ChatCarousel from "@pages/home/chat-carousel";
import MomentList from "@pages/home/moment-list";
import MarkerRankingList from "@pages/social/marker-ranking-list";
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
    <SideMain headerTitle="소셜" withNav fullHeight deviceType={deviceType} bodyStyle="pb-0">
      <div className="page-transition">
        <Section className="pb-0">
          <SectionTitle title="모먼트" subTitle="당신의 순간을 공유해보세요." />
          <MomentList data={moment || []} />
        </Section>

        <Section>
          <SectionTitle
            title="지역 채팅 및 오픈 채팅"
            subTitle="다른 사람들과 소통해보세요."
          />
          <ChatCarousel />
        </Section>

        {/* <Ads type="feed" /> */}

        <Section>
          <SectionTitle title="인기 많은 철봉" />
          <MarkerRankingList allRanking={rankingData} />
        </Section>

        <Footer />
      </div>
    </SideMain>
  );
};

export default Social;
