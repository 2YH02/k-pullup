import SideMain from "@/components/common/side-main";
import AuthError from "@/components/layout/auth-error";
import UserinfoCard from "@/components/pages/mypage/user/userinfo-card";
import UsernameCard from "@/components/pages/mypage/user/username-card";
import myInfo from "@api/user/myInfo";
import { cookies, headers } from "next/headers";

const UserPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");

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
      />
    );
  }

  return (
    <SideMain
      headerTitle="내 정보 관리"
      fullHeight
      hasBackButton
      referrer={!!referrer}
    >
      <UsernameCard user={user} />
      <UserinfoCard user={user} />
    </SideMain>
  );
};

export default UserPage;
