"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SideMain headerTitle="error" fullHeight withNav>
      <Section className="mt-10 flex flex-col items-center justify-center">
        <Text
          typography="t1"
          display="block"
          fontWeight="bold"
          textAlign="center"
        >
          error
        </Text>
        <Text typography="t6" display="block" textAlign="center">
          서버의 상태가 원활하지 않습니다.
        </Text>
        <Text typography="t6" display="block" textAlign="center">
          잠시 후 다시 시도해주세요.
        </Text>
        <div className="flex mt-3">
          <Button
            onClick={() => reset()}
            className="mr-4"
            size="sm"
            variant="contrast"
          >
            다시 시도하기
          </Button>
          <Button onClick={() => router.replace("/")} size="sm">
            홈으로 가기
          </Button>
        </div>
      </Section>
    </SideMain>
  );
};

export default Error;
