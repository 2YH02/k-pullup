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
      headerTitle="정보 수정 요청"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      <Section className="pb-1 pt-3 text-sm">
        <div className="rounded-xl border border-yellow/35 bg-yellow/10 px-3 py-2 dark:border-yellow-dark/45 dark:bg-yellow-dark/10">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="mt-1 h-4 w-4/5 rounded-md" />
        </div>
      </Section>

      <div className="flex h-full flex-col">
        <Section className="pb-2 pt-4">
          <Skeleton className="mb-1 h-5 w-44 rounded-md" />
          <Skeleton className="mb-2 h-3.5 w-4/5 rounded-md" />
          <Skeleton className="h-32 w-full rounded-xl bg-search-input-bg/70 dark:bg-black/45" />
          <Skeleton className="mt-1.5 ml-auto h-3.5 w-12 rounded-md" />
        </Section>

        <Section className="pb-0 pt-2">
          <Skeleton className="mb-1 h-5 w-62 rounded-md" />
          <div className="mb-1 flex gap-3">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-16 w-16 rounded-lg" />
            <Skeleton className="h-16 w-16 rounded-lg border-2 border-dashed border-grey-dark/60 bg-transparent dark:border-grey/50" />
          </div>
          <Skeleton className="h-3.5 w-26 rounded-md" />
        </Section>

        <Section className="pt-3">
          <Skeleton className="mb-2 h-5 w-36 rounded-md" />
          <Skeleton className="mb-2 h-13 w-full rounded-xl bg-search-input-bg/60 dark:bg-black/40" />
          <Skeleton className="mb-2 h-13 w-full rounded-xl bg-primary/10 dark:bg-primary-dark/25" />
          <Skeleton className="my-2 h-9 w-32 rounded-md web:hidden" />
          <Skeleton className="mt-1.5 h-3.5 w-52 rounded-md mo:hidden" />
          <Skeleton className="mt-2 h-52 w-full rounded-xl web:hidden" />
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
