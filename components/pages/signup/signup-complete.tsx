import Button from "@common/button";
import Section from "@common/section";
import Text from "@common/text";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export type SignupStatus = "pending" | "complete" | "error";

interface SignupCompleteProps {
  returnUrl?: string;
  status: SignupStatus;
}

const SignupComplete = ({ status, returnUrl }: SignupCompleteProps) => {
  const router = useRouter();

  const message = useMemo(() => {
    return signupStatusText(status);
  }, [status]);

  return (
    <Section className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-[220px]">
        <Image
          src="/signup-loading.gif"
          alt="회원가입 로딩"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
          priority={true}
        />
      </div>
      {message?.map((text) => {
        return (
          <Text key={text} typography="t3" fontWeight="bold">
            {text}
          </Text>
        );
      })}

      {status !== "pending" && (
        <Button
          onClick={() => {
            if (returnUrl) {
              router.replace(`/signin?returnUrl=${returnUrl}`);
            } else {
              router.replace(`/signin`);
            }
          }}
          full
          className="mt-10"
        >
          {status === "complete" ? "로그인 하러가기" : "돌아가기"}
        </Button>
      )}
    </Section>
  );
};

const signupStatusText = (status: SignupStatus) => {
  if (status === "pending") return ["회원가입 요청 중..."];
  if (status === "complete")
    return ["회원가입이 완료되었습니다.", "환영합니다!!"];
  if (status === "error") return ["잠시 후 다시 시도해주세요..."];
};

export default SignupComplete;
