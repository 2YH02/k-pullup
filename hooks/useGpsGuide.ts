import { useCallback, useEffect, useState } from "react";

interface UseGpsGuideOptions {
  storageKey: string;
  mobileBreakpoint?: number;
  showDelayMs?: number;
  hideDelayMs?: number;
}

interface UseGpsGuideReturn {
  showGuide: boolean;
  dismissGuide: () => void;
}

const useGpsGuide = ({
  storageKey,
  mobileBreakpoint = 768,
  showDelayMs = 1000,
  hideDelayMs = 3000,
}: UseGpsGuideOptions): UseGpsGuideReturn => {
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < mobileBreakpoint;
    if (!isMobile) return;

    const guideShown = sessionStorage.getItem(storageKey);
    if (guideShown) return;

    const showTimer = setTimeout(() => {
      setShowGuide(true);
    }, showDelayMs);

    const hideTimer = setTimeout(() => {
      setShowGuide(false);
      sessionStorage.setItem(storageKey, "true");
    }, hideDelayMs);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hideDelayMs, mobileBreakpoint, showDelayMs, storageKey]);

  const dismissGuide = useCallback(() => {
    sessionStorage.setItem(storageKey, "true");
    setShowGuide(false);
  }, [storageKey]);

  return { showGuide, dismissGuide };
};

export default useGpsGuide;
