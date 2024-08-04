import markerDetail from "@api/marker/marker-detail";
import NotFoud from "@pages/pullup/not-foud";
import { cookies } from "next/headers";
import ReportClient from "./report-client";

const PullupReport = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const marker = await markerDetail({ id: ~~id, cookie: decodeCookie });

  if (marker.error === "Marker not found") {
    return <NotFoud />;
  }

  return (
    <>
      <ReportClient marker={marker} />
    </>
  );
};

export default PullupReport;
