"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { TriangleAlert } from "lucide-react";

const ErrorPage = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <SideMain headerTitle="모먼트" fullHeight hasBackButton>
      <Section className="mt-8">
        <div className="mx-auto max-w-sm rounded-2xl border border-border/85 bg-surface/45 px-5 py-7 text-center dark:border-black-light/75 dark:bg-black-light/30">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary/35 bg-surface dark:border-grey-dark dark:bg-black-light/60">
            <TriangleAlert
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
            모먼트 정보를 불러오지 못했습니다.
          </Text>
          <Text
            display="block"
            textAlign="center"
            typography="t6"
            className="mb-4 text-grey-dark dark:text-grey"
          >
            잠시 후 다시 시도해주세요.
          </Text>
          <Button
            full
            size="sm"
            onClick={() => {
              reset();
            }}
          >
            다시 시도
          </Button>
        </div>
      </Section>
    </SideMain>
  );
};

export default ErrorPage;
