import reportForMymarker from "@api/report/report-for-mymarker";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import { cookies } from "next/headers";
import MyreportClient from "./myreport-client";

const MyreportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

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
      />
    );
  }

  return (
    <>
      <MyreportClient data={reports} />
    </>
  );
};

export default MyreportPage;
