import reportForMymarker from "@api/report/report-for-mymarker";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import getDeviceType from "@lib/get-device-type";
import { cookies, headers } from "next/headers";
import { type Device } from "../page";
import MyreportClient from "./myreport-client";

const MyreportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const reports = await reportForMymarker(decodeCookie);

  if (!reports || reports.message === "No reports found") {
    return (
      <NotFound
        headerTitle="받은 정보 수정 제안"
        errorTitle="받은 수정 제안이 없습니다."
        hasBackButton
        fullHeight
        backFallbackUrl="/mypage"
        deviceType={deviceType}
      />
    );
  }

  if (reports.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="받은 정보 수정 제안"
        errorTitle="로그인 후 받은 정보 수정 제안을 확인해보세요."
        returnUrl="/mypage/myreport"
        hasBackButton
        fullHeight
        deviceType={deviceType}
      />
    );
  }

  return (
    <>
      <MyreportClient
        data={reports}
        referrer={!!referrer}
        deviceType={deviceType}
      />
    </>
  );
};

export default MyreportPage;
