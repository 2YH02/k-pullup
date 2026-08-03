"use client";

import { useEffect, useState } from "react";

import List, { ListItem } from "@pages/config/config-list";
import { useTheme } from "next-themes";

const AppSetting = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes는 hydration 이후에만 정확한 theme 값을 제공
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pt-1">
      <List title="앱 설정">
        {mounted && (
          <ListItem
            title="다크모드"
            onTrue={() => setTheme("dark")}
            onFalse={() => setTheme("light")}
            initValue={resolvedTheme === "dark"}
          />
        )}
      </List>
    </div>
  );
};

export default AppSetting;
