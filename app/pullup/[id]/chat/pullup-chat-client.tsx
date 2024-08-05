"use client";

import Input from "@common/input";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import useChatIdStore from "@store/useChatIdStore";
import { Fragment, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  uid: string;
  message: string;
  userId: string;
  userNickname: string;
  roomID: string;
  timestamp: number;
  isOwner: boolean;
}

export interface Chatdata {
  msg: string;
  name: string;
  isOwner: boolean;
  mid: string;
  userid: string;
}

interface PullupChatClientProps {
  markerId: number;
}

const PullupChatClient = ({ markerId }: PullupChatClientProps) => {
  const cidState = useChatIdStore();

  const chatValue = useInput("");

  const ws = useRef<WebSocket | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [connection, setConnection] = useState(false);

  const [messages, setMessages] = useState<Chatdata[]>([]);
  const [connectionMsg, setConnectionMsg] = useState("");

  const [isChatError, setIsChatError] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    ws.current?.close();

    ws.current = new WebSocket(
      `wss://api.k-pullup.com/ws/${markerId}?request-id=${cidState.cid}`
    );

    ws.current.onopen = () => {
      setMessages([]);
      setConnection(true);
      setConnectionMsg(
        "비속어 사용에 주의해주세요. 이후 서비스 사용이 제한될 수 있습니다!"
      );
    };

    ws.current.onmessage = async (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      if (data.userNickname === "chulbong-kr") {
        const titleArr = data.message.split(" ");

        console.log(titleArr);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          msg: data.message,
          name: data.userNickname,
          isOwner: data.isOwner,
          mid: data.uid,
          userid: data.userId,
        },
      ]);
    };

    ws.current.onerror = (error) => {
      setConnectionMsg(
        "채팅방에 참여 중 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요!"
      );
      console.error("연결 에러:", error);
      setIsChatError(true);
    };

    ws.current.onclose = () => {
      console.log("연결 종료");
    };

    return () => {
      ws.current?.close();
    };
  }, [cidState.cid, markerId]);

  useEffect(() => {
    if (!ws) return;
    const pingInterval = setInterval(() => {
      ws.current?.send(JSON.stringify({ type: "ping" }));
    }, 30000);

    return () => {
      clearInterval(pingInterval);
    };
  }, []);

  useEffect(() => {
    const scrollBox = chatBox.current;

    if (scrollBox) {
      scrollBox.scrollTop = scrollBox.scrollHeight;
    }
  }, [messages]);

  const handleChat = () => {
    if (chatValue.value === "") return;
    ws.current?.send(chatValue.value);
    chatValue.resetValue();
    inputRef.current?.focus();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChat();
    }
  };

  if (!connection && !isChatError) {
    return (
      <SideMain headerTitle="철봉 채팅" fullHeight hasBackButton>
        <Section className="flex items-center justify-center h-full">
          <LoadingIcon size="lg" />
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="철봉 채팅" fullHeight hasBackButton>
      <Section className="flex flex-col pb-0 h-full">
        <Text
          typography="t7"
          textAlign="center"
          display="block"
          className="text-red dark:text-red"
        >
          {connectionMsg}
        </Text>
        {!isChatError && (
          <>
            <div className="flex flex-col justify-end grow">
              {messages.map((message) => {
                if (message.name === "chulbong-kr") return;
                if (message.msg?.includes("님이 입장하셨습니다.")) {
                  return (
                    <div
                      key={message.mid}
                      className="truncate px-5 py-2 text-center text-sm text-grey-dark"
                    >
                      <Text
                        typography="t7"
                        className="text-grey-dark dark:text-grey"
                      >
                        {message.name}님이 참여하였습니다.
                      </Text>
                    </div>
                  );
                }
                if (message.msg?.includes("님이 퇴장하셨습니다.")) {
                  return (
                    <div
                      key={message.mid}
                      className="truncate px-5 py-2 text-center text-sm text-grey-dark"
                    >
                      <Text
                        typography="t7"
                        className="text-grey-dark dark:text-grey"
                      >
                        {message.name}님이 나가셨습니다.
                      </Text>
                    </div>
                  );
                }
                return (
                  <Fragment key={message.mid}>
                    {message.userid === cidState.cid ? (
                      <div className="flex flex-col items-end w-full py-2">
                        <div className="max-w-1/2 p-1 rounded-lg bg-slate-700 shadow-sm">
                          <Text className="text-white">{message.msg}</Text>
                        </div>
                        <div className="text-xs text-grey-dark">
                          <Text typography="t7" className="text-grey">
                            {" "}
                            {message.name}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start w-full py-2">
                        <div className="max-w-1/2 p-1 rounded-lg bg-slate-600 shadow-sm">
                          <Text className="text-white">{message.msg}</Text>
                        </div>
                        <div className="text-xs text-grey-dark">
                          <Text typography="t7" className="text-grey">
                            {message.name}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
            <div className="py-4">
              <Input
                isInvalid={false}
                icon={<SendIcon />}
                disabled={!connection}
                ref={inputRef}
                maxLength={40}
                value={chatValue.value}
                onChange={chatValue.onChange}
                onKeyDown={handleKeyPress}
              />
            </div>
          </>
        )}
      </Section>
    </SideMain>
  );
};

const SendIcon = () => {
  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      height="22"
      width="22"
      className="fill-primary dark:fill-white"
    >
      <path d="M4.02 42l41.98-18-41.98-18-.02 14 30 4-30 4z" />
      <path d="M0 0h48v48h-48z" fill="none" />
    </svg>
  );
};

export default PullupChatClient;
