import { type Device } from "@/app/mypage/page";
import SideMain from "@common/side-main";
import getChatRegion from "@lib/get-chat-region";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import ChatDetailClient from "./chat-detail-client";

const ChatDetailpage = ({ params }: { params: { code: string } }) => {
  const { code } = params;
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const { getTitle } = getChatRegion();

  const headerTitle = getTitle(code);

  if (headerTitle === 404)
    return (
      <SideMain
        headerTitle="잘못된 주소입니다."
        hasBackButton
        deviceType={deviceType}
      />
    );

  return (
    <>
      <ChatDetailClient
        code={code}
        headerTitle={headerTitle as string}
        deviceType={deviceType}
      />
    </>
  );
};

export default ChatDetailpage;
