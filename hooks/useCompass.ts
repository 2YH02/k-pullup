import { useCallback, useEffect, useRef, useState } from "react";

// Extend DeviceOrientationEvent to include iOS-specific webkitCompassHeading
interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

interface UseCompassReturn {
  heading: number | null;
  /**
   * iOS 13+ 에서 나침반 권한을 요청한다.
   * 반드시 사용자 제스처(버튼 클릭 등) 안에서 호출해야 iOS 가 허용한다. (P2-5)
   */
  requestPermission: () => Promise<void>;
}

/**
 * Custom hook to get device compass heading (Device Orientation API)
 * Works even when device is stationary (unlike GPS heading)
 * Requires HTTPS and user permission on iOS 13+
 *
 * @param enabled - true 일 때만 deviceorientation 을 구독한다.
 *                   (추적 중이 아닐 때 센서 속도 리렌더 방지, P2-4)
 */
const useCompass = (enabled: boolean = true): UseCompassReturn => {
  const [heading, setHeading] = useState<number | null>(null);

  // iOS 권한이 허용된 뒤에만 구독을 시작하기 위한 플래그
  const [permissionGranted, setPermissionGranted] = useState(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const alpha = event.alpha;
    if (alpha === null) return;

    let compassHeading = alpha;
    const webkitEvent = event as DeviceOrientationEventWithWebkit;
    if (webkitEvent.webkitCompassHeading !== undefined) {
      compassHeading = webkitEvent.webkitCompassHeading;
    } else {
      compassHeading = (360 - alpha) % 360;
    }

    // 센서는 초당 수십 회 float 값을 쏟아내므로 정수로 반올림하고,
    // 값이 바뀌지 않으면 setState 를 건너뛰어 불필요한 리렌더를 막는다. (P2-4)
    const rounded = Math.round(compassHeading);
    setHeading((prev) => (prev === rounded ? prev : rounded));
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) return;

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof DOE.requestPermission === "function") {
      try {
        const permission = await DOE.requestPermission();
        setPermissionGranted(permission === "granted");
      } catch {
        // 사용자가 거부했거나 제스처 밖에서 호출된 경우 — 조용히 무시
        setPermissionGranted(false);
      }
    } else {
      // 비 iOS 또는 구형 iOS: 권한 불필요
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.DeviceOrientationEvent) return;
    if (!enabled) return;

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
    const needsPermission = typeof DOE.requestPermission === "function";

    // iOS 는 권한이 허용된 뒤에만 구독한다.
    if (needsPermission && !permissionGranted) return;

    window.addEventListener("deviceorientation", handleOrientation);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [enabled, permissionGranted, handleOrientation]);

  return { heading, requestPermission };
};

export default useCompass;
