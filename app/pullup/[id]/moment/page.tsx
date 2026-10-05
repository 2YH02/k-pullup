import getMomentForMarker from "@api/moment/get-moment-for-marker";
import NotFound from "@layout/not-found";
import MomentClient from "./moment-client";
import getServerDeviceType from "@lib/get-server-device-type";

const MomentPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const deviceType = getServerDeviceType();

  if (!id) {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="해당 위치를 찾을 수 없습니다."
      />
    );
  }

  try {
    const data = await getMomentForMarker(~~id);
    return (
      <MomentClient deviceType={deviceType} markerId={~~id} data={data || []} />
    );
  } catch {
    return (
      <NotFound
        hasBackButton
        headerTitle="모먼트"
        errorTitle="모먼트 정보를 불러오지 못했습니다."
      />
    );
  }
};

export default MomentPage;
