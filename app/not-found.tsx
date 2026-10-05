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
        <div className="mx-auto max-w-sm rounded-2xl border border-location-badge-bg/85 bg-location-badge-bg/45 px-5 py-7 text-center dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/30">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-location-badge-text/35 bg-location-badge-bg dark:border-location-badge-text-dark/35 dark:bg-location-badge-bg-dark/60">
            <FileQuestion
              size={20}
              strokeWidth={2.2}
              className="text-location-badge-text dark:text-location-badge-text-dark"
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
