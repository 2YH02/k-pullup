import Input from "@common/input";
import SideMain, { MainHeader } from "@common/side-main";
import HomeIcon from "@icons/home-icon";
import SearchIcon from "@icons/search-icon";

const Home = () => {
  return (
    <SideMain withNav>
      <MainHeader
        titile="메인"
        hasBackButton
        headerIcon={<HomeIcon color="black" size={20} />}
      />
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
