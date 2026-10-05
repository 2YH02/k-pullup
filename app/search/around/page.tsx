import AroundClient from "./around-client";
import getServerDeviceType from "@lib/get-server-device-type";

const AroundPage = () => {

  const deviceType = getServerDeviceType();

  return <AroundClient deviceType={deviceType} />;
};

export default AroundPage;
