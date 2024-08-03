import IconButton from "@common/icon-button";
import ChatBubbleIcon from "@icons/chat-bubble-icon";

const ChatButton = () => {
  return (
    <IconButton
      icon={
        <ChatBubbleIcon size={25} className="fill-primary dark:fill-primary" />
      }
      text="채팅"
      className="flex-1"
    />
  );
};

export default ChatButton;
