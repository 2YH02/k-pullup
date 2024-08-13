import SideMain from "@common/side-main";
import AppSetting from "@pages/config/app-setting";
import EtcSetting from "@pages/config/etc-setting";
import UserSetting from "@pages/config/user-setting";
import { headers } from "next/headers";
// TODO: referror 가끔 적용 안되는 문제 확인 필요

const ConfigPage = () => {
  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <SideMain
      headerTitle="설정"
      fullHeight
      hasBackButton
      background="grey"
      referrer={!!referrer}
    >
      <AppSetting />
      <UserSetting />
      <EtcSetting />
    </SideMain>
  );
};

export default ConfigPage;
