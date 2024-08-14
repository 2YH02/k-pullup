"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <SideMain headerTitle="404" fullHeight withNav>
      <Section className="mt-10 flex flex-col items-center justify-center">
        <Text
          typography="t1"
          display="block"
          fontWeight="bold"
          textAlign="center"
        >
          404
        </Text>
        <Text typography="t6" display="block" textAlign="center">
          페이지를 찾을 수 없습니다.
        </Text>
        <Button onClick={() => router.replace("/")} className="mt-3">
          홈으로 가기
        </Button>
      </Section>
    </SideMain>
  );
};

export default NotFound;
