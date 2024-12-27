import SideMain from "@common/side-main";
import NoticeList from "@components/notice/notice-list";
import getDeviceType from "@lib/get-device-type";
import Tabs from "@pages/pullup/tabs";
import { headers } from "next/headers";
import type { Device } from "../mypage/page";

export const generateMetadata = () => {
  return {
    title: "공지사항",
  };
};

const NoticePage = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const tabData = [
    { title: "전체", contents: <NoticeList tab="전체" /> },
    {
      title: "업데이트",
      contents: <NoticeList tab="업데이트" />,
    },
    {
      title: "일반",
      contents: <NoticeList tab="일반" />,
    },
  ];

  return (
    <SideMain
      headerTitle="공지사항"
      hasBackButton
      fullHeight
      deviceType={deviceType}
    >
      <Tabs tabs={tabData} />
    </SideMain>
  );
};

export default NoticePage;
