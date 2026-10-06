import markerRanking from "@api/marker/marker-ranking";
import getAllMoment from "@api/moment/get-all-moment";
import Footer from "@common/footer";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import CommunityCarousel from "@pages/social/community-carousel";
import MomentList from "@pages/home/moment-list";
import MarkerRankingList from "@pages/social/marker-ranking-list";
import getServerDeviceType from "@lib/get-server-device-type";

export const generateMetadata = () => {
  return {
    title: "소셜 - 대한민국 철봉 지도",
    description: "철봉을 찾고, 운동 기록과 지역 이야기를 나눠보세요.",
  };
};

const Social = async () => {
  const [rankingData, moment] = await Promise.all([
    markerRanking().catch(() => []),
    getAllMoment().catch(() => []),
  ]);


  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="소셜" withNav fullHeight deviceType={deviceType} bodyStyle="pb-0">
      <div className="page-transition">
        <Section className="pb-3 pt-5">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-primary dark:text-primary-light">
            함께 운동하기
          </p>
          <h1 className="mt-1 text-lg font-extrabold tracking-tight text-text-on-surface dark:text-grey-light">
            운동 기록과 지역 이야기를 나눠보세요
          </h1>
          <p className="mt-1 text-[12px] text-text-on-surface-muted dark:text-grey">
            가까운 사람들의 모먼트와 철봉 정보를 확인할 수 있어요.
          </p>
        </Section>

        <Section className="pb-0">
          <SectionTitle title="모먼트" subTitle="최근 운동 기록" />
          <MomentList data={moment || []} />
        </Section>

        <Section>
          <SectionTitle
            title="지역 커뮤니티"
            subTitle="가까운 사람들과 이야기해요."
          />
          <CommunityCarousel />
        </Section>

        {/* <Ads type="feed" /> */}

        <Section>
          <SectionTitle title="인기 철봉" subTitle="많이 찾는 장소" />
          <MarkerRankingList allRanking={rankingData} />
        </Section>

        <Footer />
      </div>
    </SideMain>
  );
};

export default Social;
