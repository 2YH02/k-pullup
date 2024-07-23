"use client";

import List, { ListItem } from "@pages/config/config-list";
import { useTheme } from "next-themes";
// TODO: 설정 페이지 다크 모드 후 새로고침 토글 false 오류 확인

const AppSetting = () => {
  const { setTheme, theme } = useTheme();

  return (
    <List title="앱 설정">
      <ListItem
        title="다크모드"
        onTrue={() => setTheme("dark")}
        onFalse={() => setTheme("light")}
        initValue={theme === "dark" ? true : false}
      />
    </List>
  );
};

export default AppSetting;
