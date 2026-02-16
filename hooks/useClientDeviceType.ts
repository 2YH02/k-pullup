"use client";

import getDeviceType from "@lib/get-device-type";
import { useEffect, useState } from "react";

type DeviceType = ReturnType<typeof getDeviceType>;

const useClientDeviceType = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    setDeviceType(getDeviceType(window.navigator.userAgent));
  }, []);

  return deviceType;
};

export default useClientDeviceType;
