import myRegisteredLocation from "@api/user/my-registered-location";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AuthError from "@layout/auth-error";
import NotFound from "@pages/mypage/locate/not-found";
import RegisteredLocateList from "@pages/mypage/locate/registered-locate-list";
import { cookies } from "next/headers";

const RankingPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

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
      />
    );
  }

  if (!markers || markers.markers.length <= 0) {
    return <NotFound />;
  }

  return (
    <SideMain headerTitle="내가 등록한 위치" hasBackButton>
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
