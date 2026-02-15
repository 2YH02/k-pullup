import myRegisteredLocation from "@api/user/my-registered-location";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import getDeviceType from "@lib/get-device-type";
import RegisteredLocateList from "@pages/mypage/locate/registered-locate-list";
import { cookies, headers } from "next/headers";
import { type Device } from "../page";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const markers = await myRegisteredLocation({
    pageParam: 1,
    cookie: decodeCookie,
  });

  if (markers.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="내가 등록한 위치"
        hasBackButton
        errorTitle="로그인 후 철봉 위치를 등록해보세요."
        returnUrl="mypage/locate"
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
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Text fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
            등록한 위치
          </Text>
          <Text typography="t6" className="mt-0.5 text-grey-dark dark:text-grey">
            총 <span className="font-bold text-primary dark:text-primary-light">{markers.totalMarkers}</span>
            곳을 등록했어요
          </Text>
        </div>
      </Section>

      <Section className="pt-2">
        <RegisteredLocateList data={markers} />
      </Section>
    </SideMain>
  );
};

export default RankingPage;
