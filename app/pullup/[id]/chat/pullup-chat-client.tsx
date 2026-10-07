"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

import type { Device } from "@/types/device";
import Button from "@common/button";
import Input from "@common/input";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";

export interface ChatMessage {
  uid: string;
  message: string;
  userId: string;
  userNickname: string;
  roomID: string;
  timestamp: number;
  isOwner: boolean;
}

type ConnectionState = "connecting" | "open" | "error";

interface PullupChatClientProps {
  markerId: number;
  deviceType?: Device;
}

const getStoredCid = () => {
  const raw = localStorage.getItem("cid");

  if (raw) {
    try {
      const value: unknown = JSON.parse(raw)?.cid;
      if (typeof value === "string" && value.length > 0) return value;
    } catch {
      // 손상된 로컬 값은 아래에서 새 식별자로 교체한다.
    }
  }

  const nextCid = v4();
  localStorage.setItem("cid", JSON.stringify({ cid: nextCid }));
  return nextCid;
};

const parseChatMessage = (value: string): ChatMessage | null => {
  try {
    const data: unknown = JSON.parse(value);
    if (!data || typeof data !== "object") return null;

    const message = data as Partial<ChatMessage>;
    if (
      typeof message.uid !== "string" ||
      typeof message.message !== "string" ||
      typeof message.userId !== "string" ||
      typeof message.userNickname !== "string"
    ) {
      return null;
    }

    return message as ChatMessage;
  } catch {
    return null;
  }
};

const PullupChatClient = ({ markerId, deviceType = "desktop" }: PullupChatClientProps) => {
  const chatValue = useInput("");
  const ws = useRef<WebSocket | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const isComposingRef = useRef(false);

  const [cid, setCid] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [subTitle, setSubTitle] = useState("");

  useEffect(() => {
    setCid(getStoredCid());
  }, []);

  useEffect(() => {
    if (!cid) return;

    const socket = new WebSocket(
      `wss://api.k-pullup.com/ws/${markerId}?request-id=${encodeURIComponent(cid)}`
    );
    ws.current = socket;
    setConnectionState("connecting");
    setMessages([]);
    setSubTitle("");

    socket.onopen = () => {
      if (ws.current !== socket) return;
      setConnectionState("open");
    };

    socket.onmessage = (event) => {
      if (typeof event.data !== "string") return;

      const data = parseChatMessage(event.data);
      if (!data) return;

      if (data.userNickname === "chulbong-kr") {
        const nextTitle = data.message.split(" ").slice(1, 4).join(" ").trim();
        if (nextTitle) setSubTitle(nextTitle);
      }

      setMessages((prevMessages) => [...prevMessages, data]);
    };

    const handleConnectionError = () => {
      if (ws.current !== socket) return;
      setConnectionState("error");
    };

    socket.onerror = handleConnectionError;
    socket.onclose = handleConnectionError;

    const pingInterval = window.setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => {
      window.clearInterval(pingInterval);
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }
      if (ws.current === socket) ws.current = null;
    };
  }, [cid, markerId]);

  useEffect(() => {
    const scrollBox = chatBox.current;
    if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;
  }, [messages]);

  const handleChat = () => {
    const message = chatValue.value.trim();
    const socket = ws.current;

    if (
      !message ||
      connectionState !== "open" ||
      !socket ||
      socket.readyState !== WebSocket.OPEN
    ) {
      return;
    }

    try {
      socket.send(message);
      chatValue.resetValue();
    } catch {
      setConnectionState("error");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current || event.nativeEvent.isComposing) return;

    if (event.key === "Enter") {
      event.preventDefault();
      handleChat();
    }
  };

  const handleReconnect = () => {
    const nextCid = v4();
    localStorage.setItem("cid", JSON.stringify({ cid: nextCid }));
    setCid(nextCid);
  };

  const headerTitle = subTitle ? `철봉 채팅 · ${subTitle}` : "철봉 채팅";

  return (
    <SideMain
      headerTitle={headerTitle}
      fullHeight
      hasBackButton
      backFallbackUrl={`/pullup/${markerId}`}
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      <div className="flex h-full min-h-0 flex-col">
        {connectionState === "connecting" && (
          <div className="flex h-full items-center justify-center px-6">
            <div className="rounded-2xl border border-primary/10 bg-search-input-bg/45 px-6 py-5 text-center dark:border-grey-dark dark:bg-black/30">
              <LoadingIcon size="lg" className="mx-auto mb-2 mt-0" />
              <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
                채팅방에 연결하고 있습니다.
              </Text>
            </div>
          </div>
        )}

        {connectionState === "error" && (
          <div className="px-6 pt-10">
            <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-5 text-center dark:border-white/10 dark:bg-black/30">
              <Text typography="t4" fontWeight="bold" display="block" className="text-primary dark:text-primary-light">
                채팅방에 연결하지 못했어요
              </Text>
              <Text typography="t7" display="block" className="mt-2 text-grey-dark dark:text-grey">
                네트워크 상태를 확인한 뒤 다시 시도해 주세요.
              </Text>
              <Button size="sm" full className="mt-4" onClick={handleReconnect}>
                다시 연결
              </Button>
            </div>
          </div>
        )}

        {connectionState === "open" && cid && (
          <>
            <div className="border-b border-primary/10 bg-location-badge-bg/45 px-4 py-2 text-center dark:border-grey-dark dark:bg-location-badge-bg-dark/25">
              <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
                서로를 배려하는 대화를 나눠 주세요.
              </Text>
            </div>

            <div
              ref={chatBox}
              role="log"
              aria-live="polite"
              className="scrollbar-hidden min-h-0 grow overflow-y-auto overflow-x-hidden px-4 py-3"
            >
              {messages.every(({ userNickname }) => userNickname === "chulbong-kr") && (
                <div className="flex min-h-32 items-center justify-center text-center">
                  <Text typography="t7" display="block" className="text-grey-dark dark:text-grey">
                    아직 대화가 없습니다. 첫 메시지를 남겨보세요.
                  </Text>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble key={message.uid} message={message} cid={cid} />
              ))}
            </div>

            <div
              className={`shrink-0 border-t border-primary/10 bg-side-main/95 px-3 pt-2 backdrop-blur-xs dark:border-grey-dark dark:bg-black/90 ${
                deviceType === "ios-mobile-app" ? "pb-8" : "pb-3"
              }`}
            >
              <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-search-input-bg/50 p-1.5 dark:border-grey-dark dark:bg-black/35">
                <Input
                  type="text"
                  className="h-9 border-none bg-transparent px-3 dark:bg-transparent"
                  inputClassName="dark:bg-transparent"
                  value={chatValue.value}
                  onChange={chatValue.onChange}
                  placeholder="메시지를 입력해 주세요."
                  aria-label="채팅 메시지"
                  autoComplete="off"
                  maxLength={40}
                  isInvalid={false}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => {
                    isComposingRef.current = true;
                  }}
                  onCompositionEnd={() => {
                    isComposingRef.current = false;
                  }}
                />
                <button
                  type="button"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-[transform,background-color,opacity] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-35 motion-reduce:transform-none motion-reduce:transition-none dark:bg-primary-dark"
                  onClick={handleChat}
                  disabled={!chatValue.value.trim()}
                  aria-label="메시지 전송"
                >
                  <SendHorizontal size={17} strokeWidth={2.3} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </SideMain>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  cid: string;
}

const MessageBubble = ({ message, cid }: MessageBubbleProps) => {
  if (message.userNickname === "chulbong-kr") return null;

  if (
    message.message.includes("님이 입장하셨습니다.") ||
    message.message.includes("님이 퇴장하셨습니다.")
  ) {
    const hasJoined = message.message.includes("님이 입장하셨습니다.");
    return (
      <div className="px-2 py-1.5 text-center motion-safe:animate-page-enter motion-reduce:animate-none">
        <span className="inline-block rounded-full border border-primary/10 bg-search-input-bg/60 px-3 py-1 text-[11px] text-grey-dark dark:border-grey-dark dark:bg-black/30 dark:text-grey">
          {message.userNickname}님이 {hasJoined ? "참여했습니다." : "나갔습니다."}
        </span>
      </div>
    );
  }

  const isMine = message.userId === cid;

  return (
    <div
      className={`flex w-full py-1.5 motion-safe:animate-page-enter motion-reduce:animate-none ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`flex max-w-[82%] flex-col ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`whitespace-pre-wrap wrap-break-word rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
            isMine
              ? "rounded-br-md bg-primary text-white dark:bg-primary-dark"
              : "rounded-bl-md border border-primary/10 bg-search-input-bg/70 text-text-on-surface dark:border-grey-dark dark:bg-black/35 dark:text-grey-light"
          }`}
        >
          {message.message}
        </div>
        <Text typography="t7" display="block" className="mt-0.5 px-1 text-grey-dark dark:text-grey">
          {message.userNickname}
        </Text>
      </div>
    </div>
  );
};

export default PullupChatClient;
