"use client";

import useDeviceType from "@hooks/useDeviceType";
import useSheetHeightStore from "@store/useSheetHeightStore";
import { useEffect } from "react";

const SheetHeightProvider = ({ children }: { children: React.ReactNode }) => {
  const { setCurHeight, setCurStyle, setSheetHeight } = useSheetHeightStore();
  const deviceType = useDeviceType();

  useEffect(() => {
    if (deviceType === "ios-mobile-app") {
      const sheetHeight = {
        STEP_1: { min: 0, max: 34, height: 27 },
        STEP_2: { min: 34, max: 62, height: 45 },
        STEP_3: { min: 62, max: 80, height: 80 },
      };
      setCurHeight(80);
      setCurStyle("mo:h-[80px]");

      setSheetHeight(sheetHeight);
    }
  }, [deviceType, setCurHeight]);

  return <>{children}</>;
};

export default SheetHeightProvider;
