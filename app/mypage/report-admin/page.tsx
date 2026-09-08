import getAllReports from "@/lib/api/report/get-all-reports";
import myInfo from "@api/user/myInfo";
import getDeviceType from "@lib/get-device-type";
import guardServerFetch from "@lib/server-fetch-guard";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { type Device } from "../page";
import ReportAdminClient from "./report-admin-client";

const ReportAdminPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  // 관리자 권한 체크: chulbong이 아니면 마이페이지로 리다이렉트
  const { status, data: user } = await guardServerFetch(() =>
    myInfo(decodeCookie)
  );
  if (status !== "ok" || !user || !user.chulbong) {
    redirect("/mypage");
  }

  const { data } = await guardServerFetch(() => getAllReports(decodeCookie));
  if (!data) {
    redirect("/mypage");
  }

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
