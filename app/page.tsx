import Badge from "@common/badge";
import Divider from "@common/divider";
import Input from "@common/input";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import LocationIcon from "@icons/location-icon";
import SearchIcon from "@icons/search-icon";
import ArticleCarousel from "@pages/home/article-carousel";
import IconLinkList from "@pages/home/icon-link-list";
// import Players from "@pages/home/players";
import RankingCarousel from "@pages/home/ranking-carousel";

const Home = () => {
  return (
    <SideMain withNav>
      <Section className="flex items-center justify-center web:pb-0">
        <Badge
          text="충남 계룡시"
          icon={<LocationIcon size={20} className="fill-primary-dark" />}
        />
      </Section>

      <Section className="mo:bg-transparent mo:dark:bg-transparent  mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0">
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
        <SectionTitle title="슬라이드" />
        <RankingCarousel />
      </Section>

      <Divider className="h-2" />

      <Section>
        <SectionTitle title="철봉 가이드" />
        {/* <Players /> */}
      </Section>
    </SideMain>
  );
};

export default Home;
