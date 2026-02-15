"use client";

import NotFound from "@layout/not-found";
import useSearchStore from "@/store/useSearchStore";
import { useEffect } from "react";

const NotFoud = ({ addr }: { addr?: string }) => {
  const removeItem = useSearchStore((state) => state.removeItem);

  useEffect(() => {
    if (addr) {
      removeItem(addr);
    }
  }, [addr, removeItem]);

  return (
    <NotFound
      errorTitle="해당 위치에 정보가 없습니다."
      headerTitle="위치 상세"
      hasBackButton
    />
  );
};

export default NotFoud;
