import Input from "@common/input";
import Section from "@common/section";
import SideMain from "@common/side-main";
import SearchIcon from "@icons/search-icon";
// TODO: 슬라이드 컴포넌트 추가

const Home = () => {
  return (
    <SideMain withNav>
      <Section>
        <Input
          isInvalid={false}
          placeholder="검색"
          icon={<SearchIcon />}
          isSearchButton
          className="shadow-sm"
        />
      </Section>
    </SideMain>
  );
};

export default Home;
