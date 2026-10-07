"use client";

import { useEffect, useState } from "react";

import Skeleton from "@common/skeleton";
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
        {mounted ? (
          <ListItem
            title="다크모드"
            description="화면을 어두운 색상으로 표시합니다."
            onTrue={() => setTheme("dark")}
            onFalse={() => setTheme("light")}
            initValue={resolvedTheme === "dark"}
          />
        ) : (
          <li className="flex min-h-16 items-center justify-between gap-3 px-3 py-2.5">
            <div>
              <Skeleton className="h-4 w-18 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-44 rounded-md" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </li>
        )}
      </List>
    </div>
  );
};

export default AppSetting;
