"use client";

import { useEffect } from "react";
import { v4 } from "uuid";

const ChatIdProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const setCid = () => {
      localStorage.setItem("cid", JSON.stringify({ cid: v4() }));
    };

    const handleStorage = (e?: StorageEvent) => {
      if (e) {
        if (e.key === "cid") {
          const cid = localStorage.getItem("cid");
          if (!cid) {
            setCid();
          }
        }
      }
    };

    setCid();

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return <>{children}</>;
};

export default ChatIdProvider;
