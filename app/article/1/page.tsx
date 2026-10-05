import Players from "@/components/pages/home/players";
import Section from "@common/section";
import SideMain from "@common/side-main";
import getServerDeviceType from "@lib/get-server-device-type";

const ArticleItemPage = () => {

  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="철봉 가이드"
      hasBackButton
      fullHeight
      deviceType={deviceType}
    >
      <Section>
        <Players />
      </Section>
    </SideMain>
  );
};

export default ArticleItemPage;
