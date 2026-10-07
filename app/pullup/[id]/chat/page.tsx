import NotFound from "@layout/not-found";
import getServerDeviceType from "@lib/get-server-device-type";

import PullupChatClient from "./pullup-chat-client";

const PullupChat = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const markerId = Number(id);

  const deviceType = getServerDeviceType();

  if (!Number.isInteger(markerId) || markerId <= 0) {
    return (
      <NotFound
        headerTitle="철봉 채팅"
        errorTitle="해당 채팅방을 찾을 수 없습니다."
        hasBackButton
        backFallbackUrl="/"
        deviceType={deviceType}
      />
    );
  }

  return (
    <>
      <PullupChatClient markerId={markerId} deviceType={deviceType} />
    </>
  );
};

export default PullupChat;
