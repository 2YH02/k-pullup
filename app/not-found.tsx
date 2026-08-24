"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { FileQuestion } from "lucide-react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <SideMain headerTitle="페이지 없음" fullHeight withNav>
      <Section className="mt-8">
        <div className="mx-auto max-w-sm rounded-2xl border border-border/85 bg-surface/45 px-5 py-7 text-center dark:border-black-light/75 dark:bg-black-light/30">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-surface dark:border-primary-light/35 dark:bg-black-light/60">
            <FileQuestion
              size={20}
              strokeWidth={2.2}
              className="text-primary dark:text-primary-light"
            />
          </div>
          <Text
            display="block"
            textAlign="center"
            fontWeight="bold"
            className="mb-1 text-text-on-surface dark:text-grey-light"
          >
            페이지를 찾을 수 없습니다
          </Text>
          <Text
            display="block"
            textAlign="center"
            typography="t6"
            className="mb-4 text-grey-dark dark:text-grey"
          >
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </Text>
          <div className="flex justify-center">
            <Button size="sm" onClick={() => router.replace("/")}>
              홈으로 가기
            </Button>
          </div>
        </div>
      </Section>
    </SideMain>
  );
};

export default NotFound;
