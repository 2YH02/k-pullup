import newPictures from "@api/marker/new-pictures";
import getAllMoment from "@api/moment/get-all-moment";
import Ads from "@common/ads";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import AroundMarkerCarousel from "@pages/home/around-marker-carousel";
import ArticleCarousel from "@pages/home/article-carousel";
import ChatCarousel from "@pages/home/chat-carousel";
import IconLinkList from "@pages/home/icon-link-list";
import LocationBadge from "@pages/home/location-badge";
import MomentList from "@pages/home/moment-list";
import NewImageSection from "@pages/home/new-image-section";
import NoticeSlide from "@pages/home/notice-slide";
import SearchInput from "@pages/home/search-input";
import { headers } from "next/headers";
import { type Device } from "./mypage/page";

const Home = async () => {
  const images = await newPictures();
  const moment = await getAllMoment();
  
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain withNav deviceType={deviceType}>
      <Section className="flex items-center justify-center web:pb-0">
        <LocationBadge />
      </Section>

      <SearchInput deviceType={deviceType} />

      <Section className="py-1">
        <NoticeSlide />
      </Section>

      <Section className="pb-0">
        <SectionTitle title="모먼트" subTitle="지금 이 순간을 기록해보세요." />
        <MomentList data={moment || []} />
      </Section>

      <Ads type="feed" />

      <Section>
        <ArticleCarousel />
      </Section>

      <Section className="pt-0">
        <IconLinkList />
      </Section>

      <NewImageSection data={images} />

      <AroundMarkerCarousel />

      <Section>
        <SectionTitle
          title="지역 채팅"
          subTitle="다른 사람들과 소통해보세요."
        />
        <ChatCarousel />
      </Section>
    </SideMain>
  );
};

export default Home;
