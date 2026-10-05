import reportForMymarker from "@api/report/report-for-mymarker";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import guardServerFetch from "@lib/server-fetch-guard";
import { cookies, headers } from "next/headers";
import MyreportClient from "./myreport-client";
import getServerDeviceType from "@lib/get-server-device-type";

const MyreportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const referrer = headersList.get("referer");

  const deviceType = getServerDeviceType();

  const { status, data: reports } = await guardServerFetch(() =>
    reportForMymarker(decodeCookie)
  );

  if (status === "unauthorized") {
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
