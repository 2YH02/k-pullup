import newPictures from "@api/marker/new-pictures";
import Divider from "@common/divider";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import AroundMarkerCarousel from "@pages/home/around-marker-carousel";
import ArticleCarousel from "@pages/home/article-carousel";
import IconLinkList from "@pages/home/icon-link-list";
import LocationBadge from "@pages/home/location-badge";
import NewImageSection from "@pages/home/new-image-section";
import Players from "@pages/home/players";
import SearchInput from "@pages/home/search-input";
import { headers } from "next/headers";
import { type Device } from "./mypage/page";

// TODO: 마커 삭제 후 등록하기 눌러서 그 위치 찍어놈 -> 다른 탭 -> 탭 돌아옴 현재위치 가있음

const Home = async () => {
  const images = await newPictures();

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain withNav deviceType={deviceType}>
      <Section className="flex items-center justify-center web:pb-0">
        <LocationBadge />
      </Section>

      <SearchInput deviceType={deviceType} />

      <Section>
        <ArticleCarousel />
      </Section>

      <Section className="pt-0">
        <IconLinkList />
      </Section>

      <Divider className="h-2" />

      <NewImageSection data={images} />

      <Divider className="h-2" />

      <AroundMarkerCarousel />

      <Divider className="h-2" />

      <Section>
        <SectionTitle title="철봉 가이드" />
        <Players />
      </Section>
    </SideMain>
  );
};

export default Home;
