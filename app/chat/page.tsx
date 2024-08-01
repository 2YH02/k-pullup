import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ChatroomList from "@pages/chat/chatroom-list";
// TODO: 지역 채팅 마지막 서비스 배포 후 확인 필요

const Chat = () => {
  return (
    <SideMain headerTitle="채팅" withNav fullHeight>
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
