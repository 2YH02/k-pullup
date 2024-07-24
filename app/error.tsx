"use client";

import Section from "@common/section";
import Button from "@common/button";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useEffect } from "react";

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <SideMain withNav>
      <Section>
        <Text typography="t4" display="block">
          잠시 후 다시 시도해주세요
        </Text>
        <Button onClick={() => reset()}>다시 시도하기</Button>
      </Section>
    </SideMain>
  );
};

export default Error;
