import { type Device } from "@/app/mypage/page";
import getChatRegion from "@lib/get-chat-region";
import getDeviceType from "@lib/get-device-type";
import NotFound from "@layout/not-found";
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
      <NotFound
        errorTitle="존재하지 않는 채팅방입니다."
        actionLabel="소셜로 가기"
        actionUrl="/social"
        prevUrl="/social"
        fullHeight
        withNav
        referrer={false}
        deviceType={deviceType}
        headerTitle="채팅방"
        hasBackButton
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
