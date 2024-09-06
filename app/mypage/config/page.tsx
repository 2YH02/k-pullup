import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import AppSetting from "@pages/config/app-setting";
import EtcSetting from "@pages/config/etc-setting";
import UserSetting from "@pages/config/user-setting";
import { headers } from "next/headers";
import { type Device } from "../page";
// TODO: referror 가끔 적용 안되는 문제 확인 필요

const ConfigPage = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="설정"
      fullHeight
      hasBackButton
      background="grey"
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <AppSetting />
      <UserSetting />
      <EtcSetting />
      <Text className="select-text">{userAgent}</Text>
    </SideMain>
  );
};

export default ConfigPage;
