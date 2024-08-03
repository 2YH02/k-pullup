import IconButton from "@common/icon-button";
import ChatBubbleIcon from "@icons/chat-bubble-icon";
import { useRouter } from "next/navigation";

interface ChatButtonProps {
  markerId: number;
}

const ChatButton = ({ markerId }: ChatButtonProps) => {
  const router = useRouter();
  return (
    <IconButton
      icon={
        <ChatBubbleIcon size={25} className="fill-primary dark:fill-primary" />
      }
      text="채팅"
      className="flex-1"
      onClick={() => router.push(`/pullup/${markerId}/chat`)}
    />
  );
};

export default ChatButton;
