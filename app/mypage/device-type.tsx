"use client";

import Text from "@common/text";
import useDeviceType from "@hooks/useDeviceType";

const DeviceType = () => {
  const deviceType = useDeviceType();

  return <Text display="block">{deviceType}</Text>;
};

export default DeviceType;
