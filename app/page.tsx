import LocationIcon from "@icons/location-icon";
import Badge from "@common/badge";
import Input from "@common/input";
import Section from "@common/section";
import SideMain from "@common/side-main";
import SearchIcon from "@icons/search-icon";
// TODO: 슬라이드 컴포넌트 추가

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
    </SideMain>
  );
};

export default Home;
