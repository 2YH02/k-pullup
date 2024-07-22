"use client";

import List, { ListItem } from "@components/pages/config/config-list";
// TODO: 다크 설정 모드 추가
// TODO: 메인 페이지 다크모드 스타일 확인 필요

const AppSetting = () => {
  const handleDarkTrue = () => {
    const asd = document.querySelector("html");
    asd?.classList.add("dark");
  };
  const handleDarkFalse = () => {
    const asd = document.querySelector("html");
    asd?.classList.remove("dark");
  };

  return (
    <List title="앱 설정">
      <ListItem
        title="다크모드"
        onTrue={handleDarkTrue}
        onFalse={handleDarkFalse}
      />
    </List>
  );
};

export default AppSetting;
