"use client";

import Text from "@common/text";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { ALL_NOTICE } from "@/constant";

export type Notice = {
  id: number;
  category: "업데이트" | "일반";
  title: string;
  content: string;
  createdAd: string;
};

export type NoticeWithActive = Notice & {
  active: boolean;
};

interface NoticeListProps {
  tab: "전체" | "업데이트" | "일반";
}

const noticeCopy = ALL_NOTICE.map((notice) => {
  return { ...notice, active: false };
});

const NoticeList = ({ tab }: NoticeListProps) => {
  const [noticeData, setNoticeData] = useState<NoticeWithActive[]>(
    noticeCopy.map((notice) => {
      return { ...notice, active: false };
    })
  );

  useEffect(() => {
    if (tab === "업데이트") {
      const newData = noticeCopy.filter(
        (notice) => notice.category === "업데이트"
      );
      setNoticeData(newData);
    } else if (tab === "일반") {
      const newData = noticeCopy.filter((notice) => notice.category === "일반");
      setNoticeData(newData);
    } else {
      setNoticeData(
        noticeCopy.map((notice) => {
          return { ...notice, active: false };
        })
      );
    }
  }, [tab]);

  const handleToggle = (id: number) => {
    const newData = noticeData.map((notice) => {
      return notice.id === id ? { ...notice, active: !notice.active } : notice;
    });

    setNoticeData(newData);
  };

  return (
    <>
      {noticeData.map((notice) => {
        return (
          <div
            key={notice.id}
            className="mb-4 p-2 border-2 border-solid border-[#ccc] rounded-md"
          >
            <button
              className="flex items-center w-full text-left"
              onClick={() => handleToggle(notice.id)}
            >
              <div className="grow">
                <div>
                  <Text
                    className="text-coral dark:text-coral"
                    fontWeight="bold"
                    typography="t6"
                  >
                    [{notice.category}]
                  </Text>
                  <Text fontWeight="bold" typography="t6">
                    {notice.title}
                  </Text>
                </div>
                <Text typography="t7" className="text-grey dark:text-grey">
                  {notice.createdAd}
                </Text>
              </div>
              <div className="p-3">
                {notice.active ? (
                  <ArrowUp size={20} color="#ccc" />
                ) : (
                  <ArrowDown size={20} color="#ccc" />
                )}
              </div>
            </button>
            {notice.active && (
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                className="text-sm dark:text-grey-light"
              >
                {notice.content}
              </ReactMarkdown>
            )}
          </div>
        );
      })}
    </>
  );
};

export default NoticeList;
