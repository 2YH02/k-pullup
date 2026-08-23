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
  const [images, moment] = await Promise.all([newPictures(), getAllMoment()]);

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain withNav deviceType={deviceType} bodyStyle="pb-0">
      <HeroStickyHeader />
      <div className="web:-mt-2">
        <SearchInput deviceType={deviceType} />
      </div>

      <div className="page-transition">
        <AroundMarkerCarousel />

        <Section className="pb-2">
          <SectionTitle title="모먼트" subTitle="지금 이 순간을 기록해보세요." />
          <MomentList data={moment || []} />
        </Section>

        {!isNewPicturesError(images) && (
          <NewImageSection data={images as NewPictures[]} />
        )}

        <Footer />
      </div>
    </SideMain>
  );
};

export default Home;
