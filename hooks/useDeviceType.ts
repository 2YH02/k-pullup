"use client";

import { useEffect, useState } from "react";

type DeviceType =
  | "android-mobile-app"
  | "ios-mobile-app"
  | "android-mobile-web"
  | "ios-mobile-web"
  | "desktop";

const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes("android-mobile-app")) {
      setDeviceType("android-mobile-app");
    } else if (userAgent.includes("ios-mobile-app")) {
      setDeviceType("ios-mobile-app");
    } else if (/android/i.test(userAgent)) {
      setDeviceType("android-mobile-web");
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      setDeviceType("ios-mobile-web");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  return deviceType;
};

export default useDeviceType;
// "use client";

// import { useEffect, useState } from "react";

// type DeviceType =
//   | "android-mobile-app"
//   | "ios-mobile-app"
//   | "android-mobile-web"
//   | "ios-mobile-web"
//   | "desktop";

// const useDeviceType = (): DeviceType | null => {
//   const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

//   useEffect(() => {
//     const userAgent = navigator.userAgent.toLowerCase();

//     if (userAgent.includes("android-mobile-app")) {
//       setDeviceType("android-mobile-app");
//     } else if (userAgent.includes("ios-mobile-app")) {
//       setDeviceType("desktop");
//     } else if (/android/i.test(userAgent)) {
//       setDeviceType("android-mobile-web");
//     } else if (/iphone|ipad|ipod/i.test(userAgent)) {
//       setDeviceType("ios-mobile-web");
//     } else {
//       setDeviceType("ios-mobile-app");
//     }
//   }, []);

//   return deviceType;
// };

// export default useDeviceType;
