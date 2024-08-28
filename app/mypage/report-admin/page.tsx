import getAllReports from "@/lib/api/report/get-all-reports";
import { cookies, headers } from "next/headers";
import ReportAdminClient from "./report-admin-client";
import getDeviceType from "@lib/get-device-type";
import { type Device } from "../page";
// TODO: 일반 유저 접근 제어 고려해보기

const ReportAdminPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const data = await getAllReports(decodeCookie);

  return (
    <>
      <ReportAdminClient
        data={data}
        referrer={!!referrer}
        deviceType={deviceType}
      />
    </>
  );
};

export default ReportAdminPage;
