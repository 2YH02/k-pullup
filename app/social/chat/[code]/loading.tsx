import { type Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getChatRegion from "@lib/get-chat-region";
import getDeviceType from "@lib/get-device-type";
import { Upload } from "lucide-react";
import { headers } from "next/headers";

const MessageBubbleSkeleton = ({ mine = false }: { mine?: boolean }) => {
  return (
    <div className={`flex w-full py-1.5 ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[88%] flex-col ${mine ? "items-end" : "items-start"}`}>
        <Skeleton className={`h-9 rounded-2xl ${mine ? "w-36" : "w-44"}`} />
        <Skeleton className="mt-1 h-2.5 w-12 rounded-md" />
      </div>
    </div>
  );
};

const Loading = ({ params }: { params: { code: string } }) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);
  const { getTitle } = getChatRegion();
  const title = getTitle(params.code);

  return (
    <SideMain
      headerTitle={title === 404 ? "채팅방" : `${title} 채팅`}
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      <div className="flex h-full flex-col">
        <Section className="py-2">
          <div className="flex items-center gap-2 rounded-xl border border-grey-light/85 bg-search-input-bg/35 px-3 py-2 dark:border-grey-dark/85 dark:bg-black/30">
            <Upload size={14} strokeWidth={2.2} className="text-grey-dark dark:text-grey" />
            <Skeleton className="h-3.5 w-28 rounded-md" />
          </div>
        </Section>

        <div className="grow overflow-hidden px-3 py-2">
          <MessageBubbleSkeleton />
          <MessageBubbleSkeleton mine />
          <MessageBubbleSkeleton />
          <MessageBubbleSkeleton mine />
          <MessageBubbleSkeleton />
        </div>

        <div className="shrink-0 border-t border-grey-light/80 bg-side-main/95 px-3 py-2 backdrop-blur-xs dark:border-grey-dark/85 dark:bg-black/90">
          <div className="flex items-center gap-2 rounded-xl border border-grey-light/80 bg-search-input-bg/45 p-1.5 dark:border-grey-dark/80 dark:bg-black/35">
            <div className="grow">
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </SideMain>
  );
};

export default Loading;
