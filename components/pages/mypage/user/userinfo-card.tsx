import type { User } from "@/types/user";
import Section, { SectionTitle } from "@common/section";
import ShadowBox from "@common/shadow-box";
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
      <ShadowBox className="p-4">
        <div className="py-1">
          <Text typography="t6" className="w-1/4">
            아이디
          </Text>
          <Text typography="t6" className="w-3/4">
            {user.email}
          </Text>
        </div>
        <div className="py-1">
          <Text typography="t6" className="w-1/4">
            이메일
          </Text>
          <Text typography="t6" className="w-3/4">
            {user.email}
          </Text>
        </div>
        <div className="flex py-1">
          <Text typography="t6" className="w-1/4">
            비밀번호
          </Text>
          <Text typography="t6" className="w-2/4 grow">
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
          >
            <EditIcon size={17} color="black" />
          </button>
        </div>
      </ShadowBox>
    </Section>
  );
};

export default UserinfoCard;
