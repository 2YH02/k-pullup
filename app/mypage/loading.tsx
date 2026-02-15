import type { Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="내 정보"
      withNav
      fullHeight
      deviceType={deviceType}
      bodyStyle="pb-0 flex flex-col"
    >
      <Section>
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="mt-2 h-4 w-56 rounded-md" />
          <Skeleton className="mt-3 h-3 w-28 rounded-md" />
          <Skeleton className="mt-1.5 h-3 w-24 rounded-md" />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-primary/10 bg-surface/70 p-1.5 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </Section>

      <Section>
        <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
          <div className="flex flex-col items-center">
            <Skeleton className="mb-2 h-4 w-16 rounded-md" />
            <Skeleton className="mb-2 h-28 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="mt-2 h-4 w-34 rounded-md" />
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="space-y-2 rounded-xl border border-primary/10 bg-surface/70 p-2 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-13 w-full rounded-lg" />
          <Skeleton className="h-13 w-full rounded-lg" />
          <Skeleton className="h-13 w-full rounded-lg" />
          <Skeleton className="h-13 w-full rounded-lg" />
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
