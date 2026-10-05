import type { Device } from "@/types/device";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

/**
 * 서버 컴포넌트(page/loading 등)에서 요청 user-agent 기반 Device 를 반환한다.
 */
const getServerDeviceType = (): Device => {
  const userAgent = headers().get("user-agent") ?? "";
  return getDeviceType(userAgent);
};

export default getServerDeviceType;
