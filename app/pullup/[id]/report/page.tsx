import { type Device } from "@/app/mypage/page";
import markerDetail from "@api/marker/marker-detail";
import getDeviceType from "@lib/get-device-type";
import NotFoud from "@pages/pullup/not-foud";
import { cookies, headers } from "next/headers";
import ReportClient from "./report-client";

const PullupReport = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const marker = await markerDetail({ id: ~~id, cookie: decodeCookie });

  if (marker.error === "Marker not found") {
    return <NotFoud />;
  }

  return (
    <>
      <ReportClient marker={marker} deviceType={deviceType} />
    </>
  );
};

export default PullupReport;
