import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";

interface AuthErrorProps {
  headerTitle: string;
  content: string;
  prevUrl: string;
  returnUrl: string;
}

const AuthError = ({
  headerTitle,
  content,
  prevUrl,
  returnUrl,
}: AuthErrorProps) => {
  const router = useRouter();
  return (
    <SideMain
      headerTitle={headerTitle}
      hasBackButton
      prevClick={() => {
        router.replace(prevUrl);
      }}
    >
      <Section className="mt-10">
        <Text display="block" textAlign="center" className="mb-5">
          {content}
        </Text>
        <Button
          onClick={() => {
            router.push(`/signin?returnUrl=${returnUrl}`);
          }}
          full
        >
          로그인하러 가기
        </Button>
      </Section>
    </SideMain>
  );
};

export default AuthError;
