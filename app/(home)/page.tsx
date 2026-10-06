import newPictures, {
  isNewPicturesError,
  type NewPictures,
} from "@api/marker/new-pictures";
import getAllMoment from "@api/moment/get-all-moment";
import Footer from "@common/footer";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import AroundMarkerCarousel from "@pages/home/around-marker-carousel";
import HeroStickyHeader from "@pages/home/hero-sticky-header";
import HomeQuickActions from "@pages/home/home-quick-actions";
import MomentList from "@pages/home/moment-list";
import NewImageSection from "@pages/home/new-image-section";
import SearchInput from "@pages/home/search-input";
import getServerDeviceType from "@lib/get-server-device-type";

const Home = async () => {
  const [images, moment] = await Promise.all([
    newPictures().catch(() => [] as NewPictures[]),
    getAllMoment().catch(() => []),
  ]);


  const deviceType = getServerDeviceType();

  return (
    <SideMain withNav deviceType={deviceType} bodyStyle="pb-0">
      <HeroStickyHeader />
      <div className="page-transition">
        <SearchInput deviceType={deviceType} />
        <HomeQuickActions />

        <AroundMarkerCarousel />

        <Section className="pb-0">
          <SectionTitle title="최근 활동" subTitle="새로운 기록" />
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
