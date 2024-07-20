import Input from "@common/input";
import SideMain from "@common/side-main";
import HomeIcon from "@icons/home-icon";
import SearchIcon from "@icons/search-icon";
// TODO: section 컴포넌트 추가
// TODO: 슬라이드 컴포넌트 추가

const Home = () => {
  return (
    <SideMain
      withNav
      headerTitle="메인"
      headerIcon={<HomeIcon color="black" size={20} />}
      hasBackButton
    >
      <div className="p-4">
        <Input
          isInvalid={false}
          placeholder="검색"
          icon={<SearchIcon />}
          isSearchButton
        />
      </div>
    </SideMain>
  );
};

export default Home;
