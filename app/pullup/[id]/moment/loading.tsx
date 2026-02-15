import { type Device } from "@/app/mypage/page";
import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getDeviceType from "@lib/get-device-type";
import { Upload } from "lucide-react";
import { headers } from "next/headers";

const MomentItemSkeleton = () => {
  return (
    <div className="px-4 py-3">
      <div className="mb-2 flex h-10 w-full items-center justify-between">
        <div className="flex flex-col">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="mt-1 h-3 w-16 rounded-md" />
        </div>
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <div className="mb-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="mt-1 h-4 w-3/4 rounded-md" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );
};

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="모먼트"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      headerIcon={
        <Upload
          size={18}
          strokeWidth={2.2}
          className="text-text-on-surface dark:text-grey-light"
        />
      }
    >
      <Section className="py-2">
        <div className="rounded-xl border border-grey-light/85 bg-search-input-bg/35 px-3 py-2 dark:border-grey-dark/85 dark:bg-black/30">
          <Skeleton className="h-4 w-44 rounded-md" />
        </div>
      </Section>

      <MomentItemSkeleton />
      <Divider className="h-px w-full bg-black/10 dark:bg-white/10" />
      <MomentItemSkeleton />
    </SideMain>
  );
};

export default Loading;
