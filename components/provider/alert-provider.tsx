"use client";

import Alert from "@common/alert";
import useAlertStore from "@store/useAlertStore";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const alertState = useAlertStore((state) => state.alertState);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.getElementById("portal"));
  }, []);

  return (
    <>
      {children}
      {portalEl && createPortal(<Alert {...alertState} />, portalEl)}
    </>
  );
};

export default AlertProvider;
