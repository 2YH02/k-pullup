import { Device } from "@/types/device";

const getDeviceType = (userAgent: string): Device => {
  if (userAgent.includes("android-mobile-app")) {
    return "android-mobile-app";
  } else if (userAgent.includes("ios-mobile-app")) {
    return "ios-mobile-app";
  } else if (/android/i.test(userAgent)) {
    return "android-mobile-web";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "ios-mobile-web";
  } else {
    return "desktop";
  }

  // return "ios-mobile-app";
};

export default getDeviceType;
