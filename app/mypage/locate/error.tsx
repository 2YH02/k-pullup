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
    router.refresh();
  }, [error.message]);

  if (error.message === "No authorization token provided") {
    return (
      <SideMain
        headerTitle="저장한 장소"
        hasBackButton
        prevClick={() => {
          router.replace("/mypage");
        }}
      >
        <Section className="mt-10">
          <Text display="block" textAlign="center" className="mb-5">
            로그인 후 철봉 위치를 등록해보세요.
          </Text>
          <Button
            onClick={() => {
              router.push("/signin?returnUrl=/mypage/locate");
            }}
            full
          >
            로그인하러 가기
          </Button>
        </Section>
      </SideMain>
    );
  }
  return (
    <SideMain
      headerTitle="저장한 장소"
      hasBackButton
      prevClick={() => {
        router.replace("/mypage");
      }}
    >
      <Section className="mt-10">
        <Text display="block" textAlign="center" className="mb-5">
          잠시 후 다시 시도해주세요.
        </Text>
        <Button onClick={() => reset()} full>
          다시 시도하기
        </Button>
      </Section>
    </SideMain>
  );
};

export default Error;
