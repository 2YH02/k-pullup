"use client";

import ListItem, { ListContents, ListRight } from "@common/list-item";
import { REGION_CHAT } from "@constant/index";
import ChatBubbleIcon from "@icons/chat-bubble-icon";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ChatroomList = () => {
  const router = useRouter();

  return (
    <ul>
      {REGION_CHAT.map((list, index) => {
        return (
          <motion.li
            initial={{
              opacity: 0,
              translateX: -90,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
            key={list.code}
          >
            <ListItem
              onClick={() => router.push(`/chat/${list.code}`)}
              as="div"
            >
              <ListContents title={list.title} />
              <ListRight>
                <ChatBubbleIcon />
              </ListRight>
            </ListItem>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default ChatroomList;
