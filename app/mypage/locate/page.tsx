import myRegisteredLocation from "@api/user/my-registered-location";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import guardServerFetch from "@lib/server-fetch-guard";
import RegisteredLocateList from "@pages/mypage/locate/registered-locate-list";
import { cookies, headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

const MyRegisteredLocationsPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const hasInternalReferrer = isInternalReferrer(referrer, headersList.get("host"));

  const deviceType = getServerDeviceType();

  const { status, data: markers } = await guardServerFetch(() =>
    myRegisteredLocation({
      pageParam: 1,
      cookie: decodeCookie,
    })
  );

  if (status === "unauthorized") {
    return (
      <AuthError
        headerTitle="내가 등록한 위치"
        hasBackButton
        errorTitle="로그인 후 철봉 위치를 등록해보세요."
        returnUrl="/mypage/locate"
        deviceType={deviceType}
      />
    );
  }

  if (!markers || markers.markers.length <= 0) {
    return (
      <NotFound
        headerTitle="내가 등록한 위치"
        hasBackButton
        prevUrl="/mypage"
        actionLabel="등록하러 가기"
        actionUrl="/register"
        errorTitle="등록한 철봉 위치가 없습니다!"
        deviceType={deviceType}
      />
    );
  }

  return (
    <SideMain
      headerTitle="내가 등록한 위치"
      hasBackButton
      backFallbackUrl="/mypage"
      referrer={hasInternalReferrer}
      deviceType={deviceType}
    >
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
            등록 수
          </Text>
          <Text typography="t4" fontWeight="bold" display="block" className="mt-0.5 text-primary dark:text-primary-light">
            {markers.totalMarkers}곳
          </Text>
          <Text typography="t7" display="block" className="mt-2 text-grey-dark dark:text-grey">
            직접 지도에 추가한 철봉 위치입니다.
          </Text>
        </div>
      </Section>

      <Section className="pt-2">
        <RegisteredLocateList data={markers} />
      </Section>
    </SideMain>
  );
};

export default MyRegisteredLocationsPage;
