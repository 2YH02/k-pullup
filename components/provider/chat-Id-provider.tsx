"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { v4 } from "uuid";

const hasValidCid = () => {
  const raw = localStorage.getItem("cid");
  if (!raw) return false;

  try {
    const value = JSON.parse(raw)?.cid;
    return typeof value === "string" && value.length > 0;
  } catch {
    return false;
  }
};

const ChatIdProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin") return;

    // 기존 cid가 있으면 재사용 (페이지 이동마다 채팅 세션이 초기화되지 않도록)
    if (!hasValidCid()) {
      localStorage.setItem("cid", JSON.stringify({ cid: v4() }));
    }
  }, [pathname]);

  return <>{children}</>;
};

export default ChatIdProvider;
