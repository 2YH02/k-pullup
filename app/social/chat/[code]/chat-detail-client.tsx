"use client";

import { type Device } from "@/app/mypage/page";
import Button from "@common/button";
import Input from "@common/input";
import SideMain from "@common/side-main";
import WarningText from "@common/warning-text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const isComposingRef = useRef(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [subTitle, setSubTitle] = useState("");

  const [cid, setCid] = useState<null | string>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isConnectionError, setIsConnectionError] = useState(false);
  const latestNotice = [...messages]
    .reverse()
    .find((message) => message.message?.includes("공지:"));

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, []);

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
    if (!ws.current) return;
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
    if (isComposingRef.current || event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
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
      <div className="flex h-full flex-col">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl border border-grey-light/85 bg-search-input-bg/40 px-6 py-5 text-center dark:border-grey-dark/85 dark:bg-black/30">
              <LoadingIcon size="lg" className="mx-auto mb-2 mt-0" />
              <div className="text-sm text-grey-dark dark:text-grey">
                채팅방에 접속 중입니다.
              </div>
            </div>
          </div>
        )}
        {isConnectionError && !isLoading ? (
          <div className="mt-10 px-6">
            <div className="rounded-2xl border border-location-badge-bg/80 bg-location-badge-bg/50 px-5 py-6 text-center dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/35">
              <div className="mb-1 text-2xl font-bold text-text-on-surface dark:text-grey-light">
                연결 실패
              </div>
              <div className="text-sm text-grey-dark dark:text-grey">
                채팅방 입장에 실패했습니다.
              </div>
              <div className="mb-4 text-sm text-grey-dark dark:text-grey">
                잠시 후 다시 접속해주세요.
              </div>
              <Button
                size="sm"
                full
                onClick={() => {
                  window.location.reload();
                }}
              >
                다시 시도
              </Button>
            </div>
          </div>
        ) : !isLoading ? (
          <>
            <div
              ref={chatBox}
              className="grow overflow-y-auto overflow-x-hidden px-3 py-2"
            >
              {latestNotice && (
                <div className="sticky top-0 z-10 pb-2">
                  <WarningText className="mx-auto max-w-[96%] rounded-xl border border-yellow/35 bg-yellow/10 px-3 py-2 text-[13px] backdrop-blur-xs dark:border-yellow-dark/45 dark:bg-yellow-dark/10">
                    {latestNotice.message}
                  </WarningText>
                </div>
              )}
              {messages.length <= 0 && (
                <div className="pt-5 text-center text-xs text-grey-dark dark:text-grey">
                  아직 메시지가 없습니다. 첫 메시지를 남겨보세요.
                </div>
              )}
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

            <div className="shrink-0 border-t border-grey-light/80 bg-side-main/95 px-3 py-2 backdrop-blur-xs dark:border-grey-dark/85 dark:bg-black/90">
              <div className="flex items-center gap-2 rounded-xl border border-grey-light/80 bg-search-input-bg/45 p-1.5 dark:border-grey-dark/80 dark:bg-black/35">
                <div className="grow">
                  <Input
                    type="text"
                    className="h-9 border-none bg-transparent"
                    value={chatValue.value}
                    onChange={chatValue.onChange}
                    placeholder="메시지를 입력해 주세요."
                    isInvalid={false}
                    onKeyDown={handleKeyPress}
                    onCompositionStart={() => {
                      isComposingRef.current = true;
                    }}
                    onCompositionEnd={() => {
                      isComposingRef.current = false;
                    }}
                  />
                </div>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-[transform,background-color] duration-150 active:scale-[0.96] active:bg-primary-dark focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:bg-primary-dark dark:active:bg-primary"
                  onClick={handleChat}
                  aria-label="메시지 전송"
                >
                  <SendHorizontal size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
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
      <div className="px-2 py-1.5 text-center motion-safe:animate-page-enter motion-reduce:animate-none">
        <span className="rounded-full border border-location-badge-bg/85 bg-location-badge-bg/70 px-3 py-1 text-[11px] text-location-badge-text dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/45 dark:text-location-badge-text-dark">
          {message.userNickname}님이 참여하였습니다.
        </span>
      </div>
    );
  }
  if (message.message?.includes("님이 퇴장하셨습니다.")) {
    return (
      <div className="px-2 py-1.5 text-center motion-safe:animate-page-enter motion-reduce:animate-none">
        <span className="rounded-full border border-grey-light/85 bg-search-input-bg/70 px-3 py-1 text-[11px] text-grey-dark dark:border-grey-dark/75 dark:bg-black/35 dark:text-grey">
          {message.userNickname}님이 나가셨습니다.
        </span>
      </div>
    );
  }

  if (message.message?.includes("공지:")) {
    return null;
  }

  const isMine = message.userId === cid;

  return (
    <div
      className={`flex w-full py-1.5 motion-safe:animate-page-enter motion-reduce:animate-none ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`flex max-w-[88%] flex-col ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2 text-sm shadow-xs ${
            isMine
              ? "bg-primary text-white dark:bg-primary-dark"
              : "border border-grey-light/85 bg-search-input-bg/70 text-text-on-surface dark:border-grey-dark/80 dark:bg-black/35 dark:text-grey-light"
          }`}
        >
          {message.message}
        </div>
        <div className="mt-0.5 px-1 text-[10px] text-grey-dark dark:text-grey">
          {message.userNickname}
        </div>
      </div>
    </div>
  );
};

export default ChatDetailClient;
