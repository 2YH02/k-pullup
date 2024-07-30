import mySuggested from "@api/report/my-suggested";
import { cookies } from "next/headers";
import ReportClient from "./report-client";

const ReportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const reports = await mySuggested(decodeCookie);

  return (
    <>
      <ReportClient data={reports} />
    </>
  );
};

export default ReportPage;
