import getMomentForMarker from "@api/moment/get-moment-for-marker";
import NotFound from "@layout/not-found";
import getServerDeviceType from "@lib/get-server-device-type";

import MomentClient from "./moment-client";

const MomentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const markerId = Number(id);

  const deviceType = getServerDeviceType();

  if (!Number.isInteger(markerId) || markerId <= 0) {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="해당 위치를 찾을 수 없습니다."
        backFallbackUrl="/"
        deviceType={deviceType}
      />
    );
  }

  try {
    const data = await getMomentForMarker(markerId);
    return (
      <MomentClient deviceType={deviceType} markerId={markerId} data={data || []} />
    );
  } catch {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="모먼트 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
        actionLabel="위치 상세로 돌아가기"
        actionUrl={`/pullup/${markerId}`}
        backFallbackUrl={`/pullup/${markerId}`}
        deviceType={deviceType}
      />
    );
  }
};

export default MomentPage;
