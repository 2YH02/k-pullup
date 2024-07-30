import reportForMymarker from "@api/report/report-for-mymarker";
import { cookies } from "next/headers";
import MyreportClient from "./myreport-client";

const MyreportPage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const reports = await reportForMymarker(decodeCookie);

  return (
    <>
      <MyreportClient data={reports} />
    </>
  );
};

export default MyreportPage;
