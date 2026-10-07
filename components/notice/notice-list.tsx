import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

import { ALL_NOTICE } from "@/constant";
import Text from "@common/text";

export type Notice = {
  id: number;
  category: "업데이트" | "일반";
  title: string;
  content: string;
  createdAt: string;
};

interface NoticeListProps {
  tab: "전체" | "업데이트" | "일반";
}

const NoticeList = ({ tab }: NoticeListProps) => {
  const notices =
    tab === "전체"
      ? ALL_NOTICE
      : ALL_NOTICE.filter(({ category }) => category === tab);

  if (notices.length === 0) {
    return (
      <div className="rounded-2xl border border-primary/10 bg-search-input-bg/45 px-4 py-8 text-center dark:border-grey-dark dark:bg-black/30">
        <Text typography="t6" display="block" className="text-grey-dark dark:text-grey">
          등록된 공지사항이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {notices.map((notice) => (
        <details
          key={notice.id}
          className="group overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/50 open:border-primary/20 open:bg-search-input-bg/65 dark:border-grey-dark dark:bg-black/35 dark:open:border-grey dark:open:bg-black/45"
        >
          <summary className="flex min-h-18 cursor-pointer list-none items-center gap-3 px-3.5 py-3 text-left transition-[background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/25 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
            <div className="min-w-0 grow">
              <span
                className={`mb-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  notice.category === "업데이트"
                    ? "bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light"
                    : "bg-location-badge-bg text-location-badge-text dark:bg-location-badge-bg-dark/45 dark:text-location-badge-text-dark"
                }`}
              >
                {notice.category}
              </span>
              <Text
                typography="t6"
                fontWeight="bold"
                display="block"
                className="wrap-break-word text-text-on-surface dark:text-grey-light"
              >
                {notice.title}
              </Text>
              <Text typography="t7" display="block" className="mt-1 text-grey-dark dark:text-grey">
                {notice.createdAt.replaceAll("-", ".")}
              </Text>
            </div>
            <ChevronDown
              size={18}
              strokeWidth={2.2}
              className="shrink-0 text-grey-dark transition-transform duration-180 group-open:rotate-180 motion-reduce:transition-none dark:text-grey"
            />
          </summary>

          <div className="border-t border-primary/10 px-4 pb-4 pt-1 text-sm leading-7 text-text-on-surface dark:border-grey-dark dark:text-grey-light">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              className="wrap-break-word [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-primary-light [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-bold"
            >
              {notice.content}
            </ReactMarkdown>
          </div>
        </details>
      ))}
    </div>
  );
};

export default NoticeList;
