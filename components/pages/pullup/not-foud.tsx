"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";

const NotFoud = () => {
  const router = useRouter();
  return (
    <SideMain
      headerTitle="위치 상세"
      hasBackButton
      prevClick={() => {
        router.back();
      }}
    >
      <Section className="mt-10">
        <Text display="block" textAlign="center" className="mb-5">
          해당 위치에 정보가 없습니다.
        </Text>
        <Button
          onClick={() => {
            router.push(`/`);
          }}
          full
        >
          홈으로 가기
        </Button>
      </Section>
    </SideMain>
  );
};

export default NotFoud;
