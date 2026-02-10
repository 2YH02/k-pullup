"use client";

import { type Device } from "@/app/mypage/page";
import Input from "@common/input";
import SideMain from "@common/side-main";
import WarningText from "@common/warning-text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import cn from "@lib/cn";
import { useEffect, useRef, useState } from "react";
import { BsArrowUp } from "react-icons/bs";

export interface ChatMessage {
  uid: string;
  message: string;
  userId: string;
  userNickname: string;
  roomID: string;
  timestamp: number;
  isOwner?: boolean;
}

interface ChatDetailClientProps {
  code: string;
  headerTitle: string;
  deviceType?: Device;
}

const ChatDetailClient = ({
  code,
  headerTitle,
  deviceType = "desktop",
}: ChatDetailClientProps) => {
  const chatValue = useInput("");

  const ws = useRef<WebSocket | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [subTitle, setSubTitle] = useState("");

  const [cid, setCid] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    const cidJson = localStorage.getItem("cid");
    if (!cidJson) return;
    const newCid = JSON.parse(cidJson).cid;
    setCid(newCid);
  }, []);

  useEffect(() => {
    ws.current?.close();

    if (!cid) return;

    ws.current = new WebSocket(
      `wss://api.k-pullup.com/ws/${code}?request-id=${cid}`
    );

    ws.current.onopen = () => {
      setIsLoading(false);
      setMessages([]);
    };

    ws.current.onmessage = async (event) => {
      const data: ChatMessage = JSON.parse(event.data);
      if (data.userNickname === "chulbong-kr") {
        const titleArr = data.message.split(" ");
        const subTitle = `${titleArr[1]} ${titleArr[2]} ${titleArr[3]}`;
        setSubTitle(subTitle);
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...data,
        },
      ]);
    };

    ws.current.onerror = () => {
      setIsLoading(false);
      setIsConnectionError(true);
    };

    ws.current.onclose = () => {
      setIsLoading(false);
      setIsConnectionError(true);
    };

    return () => {
      ws.current?.close();
    };
  }, [cid, code]);

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
  if (!cid) return null;

  return (
    <SideMain
      headerTitle={`${headerTitle as string} ${subTitle}`}
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingIcon size="lg" className="m-0" />
        </div>
      )}
      {isConnectionError ? (
        <div className="mt-14 text-center">
          <div className="text-2xl font-bold mb-1 text-black dark:text-white">
            연결 실패
          </div>
          <div className="text-grey text-sm">채팅방 입장에 실패하였습니다.</div>
          <div className="text-grey text-sm">잠시 후 다시 접속해주세요.</div>
        </div>
      ) : (
        <>
          <div
            ref={chatBox}
            className={cn(
              "h-[calc(100%-48px)] p-4 overflow-auto overflow-x-hidden"
            )}
          >
            {messages.map((message) => {
              return (
                <MessageBubble
                  key={`${message.timestamp} ${message.message} ${message.userNickname}`}
                  message={message}
                  cid={cid}
                />
              );
            })}
          </div>

          <div className={cn("shrink-0 px-4 py-1 flex gap-4 items-center")}>
            <div className="grow">
              <Input
                type="text"
                className="h-9 bg-[#f1f1f1] dark:bg-black-light border-none"
                value={chatValue.value}
                onChange={chatValue.onChange}
                placeholder="메시지를 입력해 주세요."
                isInvalid={false}
                onKeyDown={handleKeyPress}
              />
            </div>
            <div>
              <button
                className="bg-primary rounded-full dark:bg-primary p-2"
                onClick={handleChat}
              >
                <BsArrowUp className="text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </SideMain>
  );
};

const MessageBubble = ({
  message,
  cid,
}: {
  message: ChatMessage;
  cid: string;
}) => {
  if (message.userNickname === "chulbong-kr") return;
  if (message.message?.includes("님이 입장하셨습니다.")) {
    return (
      <div className="shrink-0 truncate px-5 py-2 text-center text-grey-dark p-2">
        <div className="text-grey text-xs">
          {message.userNickname}님이 참여하였습니다.
        </div>
      </div>
    );
  }
  if (message.message?.includes("님이 퇴장하셨습니다.")) {
    return (
      <div className="shrink-0 truncate px-5 py-2 text-center text-grey-dark p-2">
        <div className="text-grey text-xs">
          {message.userNickname}님이 나가셨습니다.
        </div>
      </div>
    );
  }

  if (message.message?.includes("공지:")) {
    return (
      <WarningText className="justify-center p-2">
        {message.message}
      </WarningText>
    );
  }
  return (
    <>
      {message.userId === cid ? (
        <div className="flex flex-col items-end w-full p-2">
          <div className="max-w-[90%] px-5 py-1 flex items-center justify-start rounded-3xl bg-primary dark:bg-primary-dark shadow-xs">
            <div className="text-white text-sm">{message.message}</div>
          </div>
          <div className="text-xs">
            <div className="text-[10px] mt-[2px] text-black dark:text-white">
              {message.userNickname}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start w-full p-2">
          <div className="max-w-[90%] px-5 py-1 flex items-center justify-start rounded-3xl bg-grey-light text-black-light dark:bg-grey dark:text-white shadow-xs">
            <div className="text-sm">{message.message}</div>
          </div>
          <div className="text-xs">
            <div className="text-[10px] mt-[2px] text-black dark:text-white">
              {message.userNickname}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDetailClient;
