import favorites from "@api/user/favorites";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import guardServerFetch from "@lib/server-fetch-guard";
import BookmarkList from "@pages/mypage/bookmark/bookmark-list";
import { cookies, headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");

  const deviceType = getServerDeviceType();

  const { status, data: markers } = await guardServerFetch(() =>
    favorites(decodeCookie)
  );

  if (status === "unauthorized") {
    return (
      <AuthError
        headerTitle="즐겨찾기"
        hasBackButton
        errorTitle="로그인 후 위치를 저장하고 관리해보세요!"
        returnUrl="/mypage/bookmark"
        deviceType={deviceType}
      />
    );
  }

  if (!markers?.data) {
    return (
      <NotFound
        headerTitle="즐겨찾기"
        hasBackButton
        errorTitle="저장된 위치가 없습니다."
        deviceType={deviceType}
      />
    );
  }

  const favoriteCount = markers.data.length;

  return (
    <SideMain
      headerTitle="즐겨찾기"
      hasBackButton
      backFallbackUrl="/mypage"
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
            저장한 장소
          </Text>
          <Text typography="t4" fontWeight="bold" display="block" className="mt-0.5 text-primary dark:text-primary-light">
            {favoriteCount} / 10곳
          </Text>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none dark:bg-primary-light"
              style={{ width: `${Math.min((favoriteCount / 10) * 100, 100)}%` }}
            />
          </div>
          <Text typography="t7" display="block" className="mt-2 text-grey-dark dark:text-grey">
            최대 10곳까지 저장할 수 있어요.
          </Text>
        </div>
      </Section>

      <BookmarkList data={markers.data} />
    </SideMain>
  );
};

export default RankingPage;
