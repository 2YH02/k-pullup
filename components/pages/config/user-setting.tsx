"use client";

import signout from "@api/auth/signout";
import List, { ListItem } from "@pages/config/config-list";
import { useRouter } from "next/navigation";
// TODO: 로그아웃 로딩 ui 추가

const UserSetting = () => {
  const router = useRouter();

  const handleSignout = async () => {
    await signout();
    router.replace("/mypage");
    router.refresh();
  };

  return (
    <List title="유저 설정">
      <ListItem title="로그아웃" onClick={handleSignout} />
    </List>
  );
};

export default UserSetting;
