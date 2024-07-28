"use client";

import SideMain from "@common/side-main";
import UserClientSkeleton from "@pages/mypage/user/user-client-skeleton";
import UserinfoCard from "@pages/mypage/user/userinfo-card";
import UsernameCard from "@pages/mypage/user/username-card";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserClient = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (user && user.error) {
      router.replace("/mypage");
    }
  }, [user, router]);

  if (!user) {
    return <UserClientSkeleton />;
  }

  const changeUser = (name: string) => {
    setUser({ ...user, username: name });
  };

  return (
    <SideMain headerTitle="내 정보 관리" fullHeight hasBackButton>
      <UsernameCard user={user} setUser={changeUser} />
      <UserinfoCard user={user} />
    </SideMain>
  );
};

export default UserClient;
