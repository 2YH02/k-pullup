import newPictures from "@api/marker/new-pictures";
import Divider from "@common/divider";
import Input from "@common/input";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import SearchIcon from "@icons/search-icon";
import ImageCarousel from "@layout/image-carousel";
import AroundMarkerCarousel from "@pages/home/around-marker-carousel";
import ArticleCarousel from "@pages/home/article-carousel";
import IconLinkList from "@pages/home/icon-link-list";
import LocationBadge from "@pages/home/location-badge";
import Players from "@pages/home/players";

const Home = async () => {
  const images = await newPictures();

  return (
    <SideMain withNav>
      <Section className="flex items-center justify-center web:pb-0">
        <LocationBadge />
      </Section>

      <Section className="mo:bg-transparent mo:dark:bg-transparent mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0">
        <Input
          isInvalid={false}
          placeholder="검색"
          icon={<SearchIcon />}
          isSearchButton
          className="shadow"
        />
      </Section>

      <Section>
        <ArticleCarousel />
      </Section>

      <Section className="pt-0">
        <IconLinkList />
      </Section>

      <Divider className="h-2" />

      <Section>
        <SectionTitle title="최근 추가된 이미지" />
        <ImageCarousel data={images} priority={true} withRoute />
      </Section>

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
