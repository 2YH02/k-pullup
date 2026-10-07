import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import { Upload } from "lucide-react";
import getServerDeviceType from "@lib/get-server-device-type";

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
      <Skeleton className="aspect-4/5 w-full rounded-xl" />
    </div>
  );
};

const Loading = () => {
  const deviceType = getServerDeviceType();

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
      <Section className="pb-2 pt-4">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Skeleton className="h-3.5 w-24 rounded-md" />
          <Skeleton className="mt-2 h-6 w-12 rounded-md" />
          <Skeleton className="mt-2 h-3.5 w-52 rounded-md" />
        </div>
      </Section>

      <MomentItemSkeleton />
      <Divider className="h-px w-full bg-black/10 dark:bg-white/10" />
      <MomentItemSkeleton />
    </SideMain>
  );
};

export default Loading;
