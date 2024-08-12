"use client";

import List, { ListItem } from "@pages/config/config-list";
import { useRouter } from "next/navigation";

const EtcSetting = () => {
  const router = useRouter();
  
  return (
    <List title="기타">
      <ListItem
        title="문의"
        onClick={() => router.push("/mypage/config/inquiry")}
      />
    </List>
  );
};

export default EtcSetting;
