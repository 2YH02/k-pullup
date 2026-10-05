import PullupChatClient from "./pullup-chat-client";
import getServerDeviceType from "@lib/get-server-device-type";

const PullupChat = ({ params }: { params: { id: string } }) => {
  const { id } = params;


  const deviceType = getServerDeviceType();

  return (
    <>
      <PullupChatClient markerId={~~id} deviceType={deviceType} />
    </>
  );
};

export default PullupChat;
