import Input from "@common/input";
import SideMain from "@common/side-main";
import HomeIcon from "@icons/home-icon";
import SearchIcon from "@icons/search-icon";

const Home = () => {
  return (
    <SideMain
      headerTitle="메인"
      hasHeaderBackButton
      headerIcon={<HomeIcon size={20} color="black" />}
      withNav
    >
      <Input isInvalid={false} placeholder="검색" icon={<SearchIcon />} />
    </SideMain>
  );
};

export default Home;
