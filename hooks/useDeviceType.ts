import { useEffect, useState } from "react";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/i.test(userAgent)) {
      if (/reactnative/i.test(userAgent)) {
        setDeviceType("react-native-android");
      } else {
        setDeviceType("mobile-web-android");
      }
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      if (/reactnative/i.test(userAgent)) {
        setDeviceType("react-native-ios");
      } else {
        setDeviceType("mobile-web-ios");
      }
    } else if (/windows|mac|linux/i.test(userAgent)) {
      setDeviceType("desktop-web");
    } else {
      setDeviceType("unknown");
    }
  }, []);

  return deviceType;
};

export default useDeviceType;
