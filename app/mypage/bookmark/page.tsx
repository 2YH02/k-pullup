import favorites from "@api/user/favorites";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import BookmarkList from "@pages/mypage/bookmark/bookmark-list";
import { cookies } from "next/headers";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const markers = await favorites(decodeCookie);

  if (markers.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="저장한 장소"
        hasBackButton
        errorTitle="로그인 후 위치를 저장하고 관리해보세요!"
        returnUrl="/mypage/bookmark"
      />
    );
  }

  if (!markers.data || markers.data.length <= 0) {
    return (
      <NotFound
        headerTitle="저장한 장소"
        hasBackButton
        errorTitle="저장된 위치가 없습니다."
      />
    );
  }

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
        <BookmarkList data={markers.data} />
      </Section>
    </SideMain>
  );
};

export default RankingPage;
