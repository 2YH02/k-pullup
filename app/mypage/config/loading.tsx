import type { Device } from "@/app/mypage/page";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="설정" fullHeight hasBackButton deviceType={deviceType}>
      <section className="mb-4 px-6">
        <Skeleton className="mb-2 h-4 w-16 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface/80 dark:border-grey-dark dark:bg-black">
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <Skeleton className="h-4 w-18 rounded-md" />
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mb-4 px-6">
        <Skeleton className="mb-2 h-4 w-20 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface/80 dark:border-grey-dark dark:bg-black">
          <div className="flex min-h-12 items-center justify-between border-b border-primary/10 px-3 py-2.5 dark:border-grey-dark">
            <Skeleton className="h-4 w-16 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
          <div className="flex min-h-12 items-center justify-between border-b border-primary/10 px-3 py-2.5 dark:border-grey-dark">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <Skeleton className="h-4 w-18 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
        </div>
      </section>

      <section className="mb-4 px-6">
        <Skeleton className="mb-2 h-4 w-10 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-surface/80 dark:border-grey-dark dark:bg-black">
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
        </div>
      </section>
    </SideMain>
  );
};

export default Loading;
