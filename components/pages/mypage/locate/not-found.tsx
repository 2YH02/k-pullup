"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

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
          등록한 철봉 위치가 없습니다!
        </Text>
        <Button
          onClick={() => {
            router.push("/register");
          }}
          full
        >
          등록하러 가기
        </Button>
      </Section>
    </SideMain>
  );
};

export default NotFound;
