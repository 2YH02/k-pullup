import SideMain from "@common/side-main";
import NoticeList from "@components/notice/notice-list";
import Tabs from "@common/tabs";
import getServerDeviceType from "@lib/get-server-device-type";

export const generateMetadata = () => {
  return {
    title: "공지사항",
  };
};

const NoticePage = () => {
  const deviceType = getServerDeviceType();

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
      backFallbackUrl="/"
    >
      <Tabs tabs={tabData} />
    </SideMain>
  );
};

export default NoticePage;
