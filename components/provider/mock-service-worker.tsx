"use client";

import { useEffect, useState } from "react";

const isMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

const MockServiceWorker = ({ children }: { children: React.ReactNode }) => {
  const [isReady, setIsReady] = useState(!isMockingEnabled);

  useEffect(() => {
    if (!isMockingEnabled) return;

    let isMounted = true;
    const startWorker = async () => {
      try {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
          serviceWorker: { url: "/mockServiceWorker.js" },
        });
      } catch (error) {
        console.warn("MSW를 시작하지 못해 실제 API를 사용합니다.", error);
      } finally {
        if (isMounted) setIsReady(true);
      }
    };

    void startWorker();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) return null;
  return children;
};

export default MockServiceWorker;
