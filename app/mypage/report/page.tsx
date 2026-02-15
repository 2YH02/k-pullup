import mySuggested, { type ReportsRes } from "@api/report/my-suggested";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import getDeviceType from "@lib/get-device-type";
import { cookies, headers } from "next/headers";
import { type Device } from "../page";
import ReportClient from "./report-client";

const ReportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const reports = await mySuggested(decodeCookie);

  if (reports.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="내 정보 수정 제안"
        errorTitle="로그인 후 정보 수정 제안 목록을 확인해보세요."
        returnUrl="/mypage/report"
        fullHeight
        hasBackButton
        deviceType={deviceType}
      />
    );
  }
  if (!reports.data || reports.error === "No reports found") {
    return (
      <NotFound
        headerTitle="내 정보 수정 제안"
        errorTitle="등록한 제안이 없습니다."
        fullHeight
        hasBackButton
        backFallbackUrl="/mypage"
        deviceType={deviceType}
      />
    );
  }

  return (
    <>
      <ReportClient
        data={reports.data as ReportsRes[]}
        referrer={!!referrer}
        deviceType={deviceType}
      />
    </>
  );
};

export default ReportPage;
