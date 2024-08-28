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
        headerTitle="받은 수정 요청 목록"
        errorTitle="요청한 받은 장소가 없습니다."
        hasBackButton
        fullHeight
      />
    );
  }

  if (reports.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="받은 수정 요청 목록"
        errorTitle="로그인 후 정보 제안 요청 받은 목록을 확인해보세요."
        returnUrl="/myapge/myreport"
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
