import SideMain from "@common/side-main";
import AppSetting from "@pages/config/app-setting";
import EtcSetting from "@pages/config/etc-setting";
import UserSetting from "@pages/config/user-setting";
import { headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

const ConfigPage = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");
  const host = headersList.get("host");
  const hasInternalReferrer = isInternalReferrer(referrer, host);

  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="설정"
      fullHeight
      hasBackButton
      backFallbackUrl="/mypage"
      referrer={hasInternalReferrer}
      deviceType={deviceType}
    >
      <AppSetting />
      <UserSetting />
      <EtcSetting />
    </SideMain>
  );
};

export default ConfigPage;
