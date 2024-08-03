import PullupChatClient from "./pullup-chat-client";
// TODO: 위치 채팅 마지막 서비스 배포 후 확인 필요

const PullupChat = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <>
      <PullupChatClient markerId={~~id} />
    </>
  );
};

export default PullupChat;
