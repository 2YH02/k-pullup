"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";

interface Props extends React.ComponentProps<typeof SideMain> {
  errorTitle: string;
  prevUrl?: string;
  returnUrl?: string;
}

const AuthError = ({ errorTitle, prevUrl, returnUrl, ...props }: Props) => {
  const router = useRouter();
  return (
    <SideMain
      prevClick={() => {
        if (prevUrl) {
          router.push(prevUrl);
        } else {
          router.back();
        }
      }}
      hasBackButton
      {...props}
    >
      <Section className="mt-10">
        <Text display="block" textAlign="center" className="mb-5">
          {errorTitle}
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
