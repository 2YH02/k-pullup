import favorites from "@api/user/favorites";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import BookmarkList from "@pages/mypage/bookmark/bookmark-list";
import { cookies } from "next/headers";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const markers = await favorites(decodeCookie);

  return (
    <SideMain headerTitle="저장한 장소" hasBackButton>
      <Section>
        <Text
          display="block"
          textAlign="center"
          className="text-red select-none"
        >
          위치는 총 10개까지 저장이 가능합니다.
        </Text>
      </Section>

      <Section>
        <BookmarkList data={markers} />
      </Section>
    </SideMain>
  );
};

export default RankingPage;
