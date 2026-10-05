import getChatRegion from "@lib/get-chat-region";
import NotFound from "@layout/not-found";
import ChatDetailClient from "./chat-detail-client";
import getServerDeviceType from "@lib/get-server-device-type";

const ChatDetailpage = ({ params }: { params: { code: string } }) => {
  const { code } = params;

  const deviceType = getServerDeviceType();

  const { getTitle } = getChatRegion();

  const headerTitle = getTitle(code);

  if (headerTitle === null)
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
        headerTitle={headerTitle}
        deviceType={deviceType}
      />
    </>
  );
};

export default ChatDetailpage;
