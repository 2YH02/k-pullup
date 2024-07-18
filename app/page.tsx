import SearchIcon from "@icons/search-icon";
import Input from "@common/input";
import SideMain from "@common/side-main";

const Home = () => {
  return (
    <SideMain headerTitle="메인" withNav>
      <Input isInvalid={false} placeholder="검색" icon={<SearchIcon />} />
    </SideMain>
  );
};

export default Home;
