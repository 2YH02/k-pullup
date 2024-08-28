import { headers } from "next/headers";
import PullupChatClient from "./pullup-chat-client";
import { Device } from "@/app/mypage/page";
import getDeviceType from "@lib/get-device-type";

const PullupChat = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <>
      <PullupChatClient markerId={~~id} deviceType={deviceType} />
    </>
  );
};

export default PullupChat;
