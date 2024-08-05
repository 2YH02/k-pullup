import getAllReports from "@/lib/api/report/get-all-reports";
import { cookies } from "next/headers";
import ReportAdminClient from "./report-admin-client";
// TODO: 일반 유저 접근 제어 고려해보기

const ReportAdminPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const data = await getAllReports(decodeCookie);

  return (
    <>
      <ReportAdminClient data={data} />
    </>
  );
};

export default ReportAdminPage;
