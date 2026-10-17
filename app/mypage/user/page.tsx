import myInfo from "@api/user/myInfo";
import SideMain from "@common/side-main";
import AuthError from "@layout/auth-error";
import guardServerFetch from "@lib/server-fetch-guard";
import UserinfoCard from "@pages/mypage/user/userinfo-card";
import UsernameCard from "@pages/mypage/user/username-card";
import { cookies, headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

const UserPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const hasInternalReferrer = isInternalReferrer(referrer, headersList.get("host"));

  const deviceType = getServerDeviceType();

  const { status, data: user } = await guardServerFetch(() =>
    myInfo(decodeCookie)
  );

  if (status !== "ok" || !user) {
    return (
      <AuthError
        headerTitle="내 정보 관리"
        errorTitle="로그인이 필요합니다."
        returnUrl="/mypage/user"
        fullHeight
        hasBackButton
        deviceType={deviceType}
      />
    );
  }

  return (
    <SideMain
      headerTitle="내 정보 관리"
      fullHeight
      hasBackButton
      referrer={hasInternalReferrer}
      deviceType={deviceType}
    >
      <UsernameCard user={user} />
      <UserinfoCard user={user} />
    </SideMain>
  );
};

export default UserPage;
