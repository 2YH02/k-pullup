import { useEffect, useState } from "react";

// Extend DeviceOrientationEvent to include iOS-specific webkitCompassHeading
interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

/**
 * Custom hook to get device compass heading (Device Orientation API)
 * Works even when device is stationary (unlike GPS heading)
 * Requires HTTPS and user permission on iOS 13+
 *
 * @returns Current compass heading in degrees (0-360, where 0 = North)
 */
const useCompass = (): number | null => {
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if (!window.DeviceOrientationEvent) {
      console.warn("Device Orientation API not supported");
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // alpha: 0-360 degrees (compass heading)
      // 0 = North, 90 = East, 180 = South, 270 = West
      const alpha = event.alpha;

      if (alpha !== null) {
        // On iOS, alpha is relative to device orientation
        // For proper compass, we need to adjust based on screen orientation
        let compassHeading = alpha;

        // Adjust for screen orientation (iOS Safari)
        const webkitEvent = event as DeviceOrientationEventWithWebkit;
        if (webkitEvent.webkitCompassHeading !== undefined) {
          // iOS provides webkitCompassHeading (true compass heading)
          compassHeading = webkitEvent.webkitCompassHeading;
        } else {
          // Android: alpha is already compass heading
          // Ensure 0-360 range
          compassHeading = (360 - alpha) % 360;
        }

        setHeading(compassHeading);
      }
    };

    // Request permission on iOS 13+
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as any
          ).requestPermission();
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          } else {
            console.warn("Device orientation permission denied");
          }
        } catch (error) {
          console.error("Error requesting device orientation permission:", error);
        }
      } else {
        // Non-iOS or older iOS - no permission needed
        window.addEventListener("deviceorientation", handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return heading;
};

export default useCompass;
