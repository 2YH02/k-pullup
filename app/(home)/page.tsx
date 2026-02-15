import newPictures, {
  isNewPicturesError,
  type NewPictures,
} from "@api/marker/new-pictures";
import getAllMoment from "@api/moment/get-all-moment";
import Footer from "@common/footer";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import AroundMarkerCarousel from "@pages/home/around-marker-carousel";
import HeroStickyHeader from "@pages/home/hero-sticky-header";
import MomentList from "@pages/home/moment-list";
import NewImageSection from "@pages/home/new-image-section";
import SearchInput from "@pages/home/search-input";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";

const Home = async () => {
  const images = await newPictures();
  const moment = await getAllMoment();

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain withNav deviceType={deviceType} bodyStyle="pb-0">
      <HeroStickyHeader />
      <SearchInput deviceType={deviceType} />

      <div className="page-transition">
        <Section className="pb-0">
          <SectionTitle title="모먼트" subTitle="지금 이 순간을 기록해보세요." />
          <MomentList data={moment || []} />
        </Section>

        {/* <Section className="py-1">
          <NoticeSlide />
        </Section> */}

        {/* <Ads type="feed" /> */}

        {/* <Section>
          <ArticleCarousel />
        </Section>

        <Section className="pt-0">
          <IconLinkList />
        </Section> */}

        <AroundMarkerCarousel />

        {!isNewPicturesError(images) && (
          <NewImageSection data={images as NewPictures[]} />
        )}

        {/* <Section>
          <SectionTitle
            title="지역 채팅"
            subTitle="다른 사람들과 소통해보세요."
          />
          <ChatCarousel />
        </Section> */}

        <Footer />
      </div>
    </SideMain>
  );
};

export default Home;
