import Badge from "@common/badge";
import Divider from "@common/divider";
import Input from "@common/input";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ArticleCarousel from "@components/pages/home/article-carousel";
import IconLinkList from "@components/pages/home/icon-link-list";
import RankingCarousel from "@components/pages/home/ranking-carousel";
import LocationIcon from "@icons/location-icon";
import SearchIcon from "@icons/search-icon";

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

      <Divider className="h-2"/>

      <Section>
        <Text className="px-1" typography="t6" fontWeight="bold">
          슬라이드
        </Text>
        <RankingCarousel />
      </Section>
    </SideMain>
  );
};

export default Home;
