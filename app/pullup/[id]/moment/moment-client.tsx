"use client";

import type { Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AddMomentButton from "@pages/pullup/moment/add-moment-button";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MomentClient = ({ deviceType }: { deviceType: Device }) => {
  const router = useRouter();
  const [contentsStatus, setContentsStatus] = useState<"add" | "list">("list");

  const setContentsToList = () => setContentsStatus("list");
  const setContentsToAdd = () => setContentsStatus("add");

  return (
    <SideMain
      headerTitle={contentsStatus === "add" ? "모먼트 추가" : "모먼트"}
      fullHeight
      hasBackButton
      deviceType={deviceType}
      prevClick={contentsStatus === "add" ? setContentsToList : router.back}
    >
      {contentsStatus === "list" ? (
        <Section>
          <AddMomentButton onClick={setContentsToAdd} />
        </Section>
      ) : (
        <Section>
          <Text>모먼트 추가 페이지</Text>
        </Section>
      )}
    </SideMain>
  );
};

export default MomentClient;
