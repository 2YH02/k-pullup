"use client";

import signout from "@api/auth/signout";
import deleteUser from "@api/user/deleteUser";
import List, { ListItem } from "@pages/config/config-list";
import useAlertStore from "@store/useAlertStore";
import useUserStore from "@store/useUserStore";
import { useRouter } from "next/navigation";

const UserSetting = () => {
  const router = useRouter();

  const { user, setUser } = useUserStore();
  const { openAlert } = useAlertStore();

  console.log(user);

  const handleSignout = async () => {
    await signout();
    router.replace("/mypage");
    router.refresh();
    setUser(null);
  };

  const handleResign = () => {
    openAlert({
      title: "정말 탈퇴하시겠습니까?",
      description:
        "추가하신 마커는 유지되고, 작성한 댓글 밑 사진은 모두 삭제됩니다!",
      onClickAsync: async () => {
        const response = await deleteUser();

        if (!response.ok) {
          if (response.status === 401) {
            openAlert({
              title: "접근 권한이 없습니다.",
              description: "로그인 후 다시 시도해 주세요.",
              onClick: () => {
                router.push("/signin?returnUrl=/mypage/config");
                setUser(null);
              },
            });
          } else {
            openAlert({
              title: "잠시 후 다시 시도해주세요.",
              onClick: () => {},
            });
          }

          return;
        }

        openAlert({
          title: "회원 탈퇴가 완료되었습니다.",
          description:
            "그동안 이용해주셔서 감사합니다. 언제든 다시 찾아주세요!",
          onClick: () => {
            router.replace("/");
            router.refresh();
            setUser(null);
          },
        });
      },
      cancel: true,
    });
  };

  if (!user || user.error) return null;

  return (
    <List title="사용자 설정">
      <ListItem title="로그아웃" onClick={handleSignout} />
      {user.provider === "website" && (
        <ListItem title="비밀번호 초기화" url="/reset-password" link />
      )}
      <ListItem title="회원 탈퇴" onClick={handleResign} />
    </List>
  );
};

export default UserSetting;
