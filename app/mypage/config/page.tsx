import AppSetting from "@pages/config/app-setting";
import SideMain from "@common/side-main";

const ConfigPage = () => {
  return (
    <SideMain headerTitle="설정" fullHeight hasBackButton background="grey">
      <AppSetting />
    </SideMain>
  );
};

export default ConfigPage;
