import favorites from "@api/user/favorites";
import Section from "@common/section";
import SideMain from "@common/side-main";
import WarningText from "@common/warning-text";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import getDeviceType from "@lib/get-device-type";
import BookmarkList from "@pages/mypage/bookmark/bookmark-list";
import { cookies, headers } from "next/headers";
import { type Device } from "../page";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const markers = await favorites(decodeCookie);

  if (markers.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="저장한 장소"
        hasBackButton
        errorTitle="로그인 후 위치를 저장하고 관리해보세요!"
        returnUrl="/mypage/bookmark"
        deviceType={deviceType}
      />
    );
  }

  if (!markers.data || markers.data.length <= 0) {
    return (
      <NotFound
        headerTitle="저장한 장소"
        hasBackButton
        errorTitle="저장된 위치가 없습니다."
        deviceType={deviceType}
      />
    );
  }

  return (
    <SideMain
      headerTitle="저장한 장소"
      hasBackButton
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section className="pb-0">
        <WarningText>즐겨찾기는 최대 10개까지 추가할 수 있습니다.</WarningText>
      </Section>

      <BookmarkList data={markers.data} />
    </SideMain>
  );
};

export default RankingPage;
