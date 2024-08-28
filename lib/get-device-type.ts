const getDeviceType = (userAgent: string) => {
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

  // if (userAgent.includes("android-mobile-app")) {
  //   return "android-mobile-app";
  // } else if (userAgent.includes("ios-mobile-app")) {
  //   return "desktop";
  // } else if (/android/i.test(userAgent)) {
  //   return "android-mobile-web";
  // } else if (/iphone|ipad|ipod/i.test(userAgent)) {
  //   return "ios-mobile-web";
  // } else {
  //   return "ios-mobile-app";
  // }
};

export default getDeviceType;
