"use client";

import { type Device } from "@/app/mypage/page";
import Button from "@common/button";
import GrowBox from "@common/grow-box";
import Input from "@common/input";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import LoadingIcon from "@icons/loading-icon";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";

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
  deviceType?: Device;
}

const PullupChatClient = ({
  markerId,
  deviceType = "desktop",
}: PullupChatClientProps) => {
  const router = useRouter();

  const chatValue = useInput("");

  const ws = useRef<WebSocket | null>(null);
  const chatBox = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [connection, setConnection] = useState(true);

  const [messages, setMessages] = useState<Chatdata[]>([]);
  const [connectionMsg, setConnectionMsg] = useState("");

  const [isChatError, setIsChatError] = useState(false);

  const [subTitle, setSubTitle] = useState("");

  const [cid, setCid] = useState<null | string>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  }, [inputRef]);

  useEffect(() => {
    const cid = localStorage.getItem("cid");
    setCid(cid);
  }, []);

  useEffect(() => {
    ws.current?.close();

    if (!cid) return;

    ws.current = new WebSocket(
      `wss://api.k-pullup.com/ws/${markerId}?request-id=${cid}`
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

        setSubTitle(`${titleArr[1]} ${titleArr[2]} ${titleArr[3]}`);
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
      setConnectionMsg(
        "채팅방에 참여 중 에러가 발생하였습니다. 잠시 후 다시 시도해 주세요!"
      );
      console.log("연결 종료");
      setIsChatError(true);
    };

    return () => {
      ws.current?.close();
    };
  }, [cid, markerId]);

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
      <SideMain
        headerTitle={`철봉 채팅`}
        fullHeight
        hasBackButton
        deviceType={deviceType}
      >
        <Section className="flex items-center justify-center h-full">
          <LoadingIcon size="lg" className="m-0" />
        </Section>
      </SideMain>
    );
  }

  return (
    <SideMain
      headerTitle={`철봉 채팅 ${subTitle}`}
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      <Section className="flex flex-col pb-0 h-full">
        <Text
          typography="t7"
          textAlign="center"
          display="block"
          className="text-red dark:text-red"
        >
          {connectionMsg}
        </Text>
        {!isChatError ? (
          <>
            <div
              className="flex flex-col h-full overflow-auto scrollbar-hidden"
              ref={chatBox}
            >
              <GrowBox />
              {messages.map((message) => {
                if (message.name === "chulbong-kr") return;
                if (message.msg?.includes("님이 입장하셨습니다.")) {
                  return (
                    <div
                      key={message.mid}
                      className="shrink-0 truncate px-5 py-2 text-center text-sm text-grey-dark"
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
                      className="shrink-0 truncate px-5 py-2 text-center text-sm text-grey-dark"
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
                    {message.userid === cid ? (
                      <div className="flex flex-col items-end w-full py-2">
                        <div className="max-w-42.5 px-5 py-1 flex items-center justify-start rounded-3xl bg-primary-dark dark:bg-slate-700 shadow-xs">
                          <Text className="text-white break-all max-w-1/2">
                            {message.msg}
                          </Text>
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
                        <div className="max-w-42.5 px-5 py-1 flex items-center justify-start rounded-3xl bg-primary dark:bg-slate-600 shadow-xs">
                          <Text className="text-white break-all max-w-1/2">
                            {message.msg}
                          </Text>
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
            <div
              className={deviceType === "ios-mobile-app" ? "pt-2 pb-8" : "py-2"}
            >
              <Input
                isInvalid={false}
                icon={<SendIcon />}
                disabled={!connection}
                ref={inputRef}
                maxLength={40}
                value={chatValue.value}
                onChange={chatValue.onChange}
                onKeyDown={handleKeyPress}
                onIconClick={handleChat}
              />
            </div>
          </>
        ) : (
          <div className="mt-5 mx-auto">
            <Button
              onClick={() => {
                localStorage.setItem("cid", JSON.stringify({ cid: v4() }));
                router.refresh();
              }}
            >
              새로고침
            </Button>
          </div>
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
