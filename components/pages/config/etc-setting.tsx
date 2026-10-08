"use client";

import List, { ListItem } from "@pages/config/config-list";
const EtcSetting = () => {
  return (
    <List title="기타">
      <ListItem
        title="공지사항"
        description="새로운 기능과 서비스 소식을 확인합니다."
        url="/notice"
        link
      />
      <ListItem
        title="문의 및 서비스 안내"
        description="서비스 정보와 문의 방법을 확인합니다."
        url="/mypage/config/inquiry"
        link
      />
      <ListItem
        title="약관 및 정책"
        description="서비스 이용약관과 개인정보 정책을 확인합니다."
        url="/terms"
        link
      />
    </List>
  );
};

export default EtcSetting;
