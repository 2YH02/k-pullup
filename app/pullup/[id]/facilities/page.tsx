import { headers } from "next/headers";

import getFacilities from "@api/marker/get-facilities";
import SideMain from "@common/side-main";
import NotFound from "@layout/not-found";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

import FacilitiesClient from "./facilities-client";

const FacilitiesPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const markerId = Number(id);

  const headersList = headers();
  const referrer = headersList.get("referer");
  const hasInternalReferrer = isInternalReferrer(referrer, headersList.get("host"));

  const deviceType = getServerDeviceType();

  if (!Number.isInteger(markerId) || markerId <= 0) {
    return (
      <NotFound
        hasBackButton
        headerTitle="기구 정보 수정"
        errorTitle="해당 위치를 찾을 수 없습니다."
        backFallbackUrl="/"
        deviceType={deviceType}
      />
    );
  }

  const facilities = await getFacilities(markerId).catch(() => null);

  if (!facilities) {
    return (
      <NotFound
        hasBackButton
        headerTitle="기구 정보 수정"
        errorTitle="기구 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        actionLabel="위치 상세로 돌아가기"
        actionUrl={`/pullup/${markerId}`}
        backFallbackUrl={`/pullup/${markerId}`}
        deviceType={deviceType}
      />
    );
  }

  return (
    <SideMain
      headerTitle="기구 정보 수정"
      hasBackButton
      withNav
      fullHeight
      referrer={hasInternalReferrer}
      deviceType={deviceType}
      dragable={false}
      bodyStyle="pb-0 mo:pb-0"
    >
      <FacilitiesClient markerId={markerId} initialFacilities={facilities} />
    </SideMain>
  );
};

export default FacilitiesPage;
