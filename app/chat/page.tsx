import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import ChatroomList from "@pages/chat/chatroom-list";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";

const Chat = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="채팅" withNav fullHeight deviceType={deviceType}>
      <Section>
        <div>
          <Text typography="t6" textAlign="center" display="block">
            대한민국 철봉 지도와 함께하는 실시간 채팅!
          </Text>
          <Text typography="t6" textAlign="center" display="block">
            원하는 지역에서 사람들과 소통해 보세요.
          </Text>
        </div>
      </Section>
      <Section>
        <ChatroomList />
      </Section>
    </SideMain>
  );
};

export default Chat;
