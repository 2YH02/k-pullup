import SideMain from "@common/side-main";
import getChatRegion from "@lib/get-chat-region";
import ChatDetailClient from "./chat-detail-client";

const ChatDetailpage = ({ params }: { params: { code: string } }) => {
  const { code } = params;

  const { getTitle } = getChatRegion();

  const headerTitle = getTitle(code);

  if (headerTitle === 404)
    return <SideMain headerTitle="잘못된 주소입니다." hasBackButton></SideMain>;

  return (
    <>
      <ChatDetailClient code={code} headerTitle={headerTitle as string} />
    </>
  );
};

export default ChatDetailpage;
