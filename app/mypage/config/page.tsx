import SideMain from "@common/side-main";
import AppSetting from "@pages/config/app-setting";
import UserSetting from "@pages/config/user-setting";

const ConfigPage = () => {
  return (
    <SideMain headerTitle="설정" fullHeight hasBackButton background="grey">
      <AppSetting />
      <UserSetting />
    </SideMain>
  );
};

export default ConfigPage;
