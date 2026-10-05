"use client";

import type { User } from "@/types/user";
import Section, { SectionTitle } from "@common/section";
import Text from "@common/text";
import EditIcon from "@icons/edit-icon";
import useAlertStore from "@store/useAlertStore";
import { useRouter } from "next/navigation";

interface UserinfoCardProps {
  user: User;
}

const UserinfoCard = ({ user }: UserinfoCardProps) => {
  const router = useRouter();
  const { openAlert } = useAlertStore();
  return (
    <Section>
      <SectionTitle title="개인 정보" />
      <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
        {user.provider && user.provider !== "website" && (
          <div className="flex items-center gap-2 py-2">
            <Text typography="t6" className="w-16 text-grey-dark dark:text-grey">
              연동
            </Text>
            <Text typography="t6" className="text-primary dark:text-primary-light">
              {oauthText(user.provider)}
            </Text>
          </div>
        )}

        <div className="flex items-center gap-2 py-2">
          <Text typography="t6" className="w-16 text-grey-dark dark:text-grey">
            이메일
          </Text>
          <Text typography="t6">
            {user.email}
          </Text>
        </div>
        {user.provider === "website" && (
          <div className="flex items-center gap-2 border-t border-primary/10 pt-2 mt-1 dark:border-grey-dark">
            <Text typography="t6" className="w-16 text-grey-dark dark:text-grey">
              비밀번호
            </Text>
            <Text typography="t6" className="grow">
              ***********
            </Text>
            <button
              onClick={() => {
                openAlert({
                  title: "비밀번호 초기화",
                  description: "비밀번호를 초기화하러 이동하시겠습니까?",
                  onClick: () => router.push("/reset-password"),
                  cancel: true,
                });
              }}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-primary transition-colors duration-150 web:hover:bg-primary/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:text-primary-light dark:web:hover:bg-primary-dark/20"
              aria-label="비밀번호 수정"
            >
              <EditIcon size={15} color="primary" />
              <Text typography="t7" className="text-primary dark:text-primary-light">
                수정
              </Text>
            </button>
          </div>
        )}
      </div>
    </Section>
  );
};

const oauthText = (provider: "google" | "naver" | "kakao" | "website") => {
  if (provider === "google") {
    return "구글";
  } else if (provider === "naver") {
    return "네이버";
  } else if (provider === "kakao") {
    return "카카오";
  }
};

export default UserinfoCard;
