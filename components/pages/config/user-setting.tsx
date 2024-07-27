"use client";

import signout from "@api/auth/signout";
import List, { ListItem } from "@pages/config/config-list";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";
// TODO: 회원 탈퇴

const UserSetting = () => {
  const router = useRouter();

  const { user, setUser } = useUserStore();

  const handleSignout = async () => {
    await signout();
    router.replace("/mypage");
    router.refresh();
    setUser(null);
  };

  const handleResign = () => {
    console.log("회원 탈퇴");
  };

  if (!user) return null;

  return (
    <List title="사용자 설정">
      <ListItem title="로그아웃" onClick={handleSignout} />
      <ListItem
        title="비밀번호 초기화"
        url="/reset-password"
        link
      />
      <ListItem title="회원 탈퇴" onClick={handleResign} />
    </List>
  );
};

export default UserSetting;
