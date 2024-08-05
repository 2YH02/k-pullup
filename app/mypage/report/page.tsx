import mySuggested, { type ReportsRes } from "@api/report/my-suggested";
import AuthError from "@layout/auth-error";
import NotFound from "@layout/not-found";
import { cookies } from "next/headers";
import ReportClient from "./report-client";

const ReportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const reports = await mySuggested(decodeCookie);

  if (reports.error === "No authorization token provided") {
    return (
      <AuthError
        headerTitle="정보 수정 요청 목록"
        errorTitle="로그인 후 정보 수정 제안 목록을 확인해보세요."
        returnUrl="/mypage/report"
        fullHeight
        hasBackButton
      />
    );
  }
  if (!reports.data || reports.error === "No reports found") {
    return (
      <NotFound
        headerTitle="정보 수정 요청 목록"
        errorTitle=" 요청한 장소가 없습니다."
        fullHeight
        hasBackButton
      />
    );
  }

  return (
    <>
      <ReportClient data={reports.data as ReportsRes[]} />
    </>
  );
};

export default ReportPage;
