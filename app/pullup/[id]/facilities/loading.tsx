import { type Device } from "@/app/mypage/page";
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
      headerTitle="기구 개수 등록"
      hasBackButton
      withNav
      deviceType={deviceType}
      dragable={false}
      bodyStyle="pb-0"
    >
      <div className="flex min-h-full flex-col">
        <Section className="pb-0 pt-4">
          <div className="mb-5 rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/50 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="mt-1 h-4 w-56 rounded-md" />
          </div>

          <div className="rounded-xl border border-primary/25 bg-search-input-bg/45 px-3 py-2 dark:border-primary-dark/50 dark:bg-black/30">
            <div className="my-1.5 flex items-center rounded-lg px-1.5 py-1">
              <Skeleton className="h-4 w-10 rounded-md" />
              <div className="grow" />
              <div className="flex items-center rounded-full border border-grey-light/80 bg-side-main px-1 py-0.5 dark:border-grey-dark/80 dark:bg-black/35">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="mx-1 h-4 w-8 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
            <div className="my-1.5 flex items-center rounded-lg px-1.5 py-1">
              <Skeleton className="h-4 w-12 rounded-md" />
              <div className="grow" />
              <div className="flex items-center rounded-full border border-grey-light/80 bg-side-main px-1 py-0.5 dark:border-grey-dark/80 dark:bg-black/35">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="mx-1 h-4 w-8 rounded-md" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-3 h-4 w-32 rounded-md" />
        </Section>

        <div className="grow" />

        <div className="sticky bottom-0 z-30 w-full border-t border-primary/10 bg-side-main/95 p-4 backdrop-blur-xs dark:border-grey-dark dark:bg-black/90">
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
    </SideMain>
  );
};

export default Loading;
