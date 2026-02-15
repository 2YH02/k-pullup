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
        headerTitle="저장한 장소"
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
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section>
        <Text
          display="block"
          textAlign="center"
          className="select-none mt-3"
          fontWeight="bold"
        >
          내가 등록한 철봉 위치
        </Text>
      </Section>

      <Section>
        <RegisteredLocateList data={markers} />
      </Section>
    </SideMain>
  );
};

export default RankingPage;
