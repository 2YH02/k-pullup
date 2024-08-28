import myInfo from "@api/user/myInfo";
import SideMain from "@common/side-main";
import AuthError from "@layout/auth-error";
import getDeviceType from "@lib/get-device-type";
import UserinfoCard from "@pages/mypage/user/userinfo-card";
import UsernameCard from "@pages/mypage/user/username-card";
import { cookies, headers } from "next/headers";
import { type Device } from "../page";

const UserPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const user = await myInfo(decodeCookie);

  const noUser = !user || user.error;

  if (noUser) {
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
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <UsernameCard user={user} />
      <UserinfoCard user={user} />
    </SideMain>
  );
};

export default UserPage;
