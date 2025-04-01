import { type Device } from "@/app/mypage/page";
import Players from "@/components/pages/home/players";
import Section from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const ArticleItemPage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

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
