import markerDetail from "@api/marker/marker-detail";
import guardServerFetch from "@lib/server-fetch-guard";
import NotFound from "@layout/not-found";
import { cookies } from "next/headers";
import ReportClient from "./report-client";
import getServerDeviceType from "@lib/get-server-device-type";

const PullupReport = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());


  const deviceType = getServerDeviceType();

  const { status, data: marker } = await guardServerFetch(() =>
    markerDetail({ id: ~~id, cookie: decodeCookie })
  );

  if (status !== "ok" || !marker) {
    return (
      <NotFound
        hasBackButton
        headerTitle="정보 수정 요청"
        errorTitle="해당 위치의 정보를 찾을 수 없습니다."
      />
    );
  }

  return (
    <>
      <ReportClient marker={marker} deviceType={deviceType} />
    </>
  );
};

export default PullupReport;
