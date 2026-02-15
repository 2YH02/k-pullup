import { type Device } from "@/app/mypage/page";
import Divider from "@common/divider";
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
    <SideMain headerTitle="위치 상세" hasBackButton deviceType={deviceType}>
      <div className="px-6 pt-4">
        <Skeleton className="h-52 w-full rounded-xl" />
      </div>

      <Section className="pt-3">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-24 rounded-3xl" />
          <Skeleton className="h-7 w-22 rounded-3xl" />
          <Skeleton className="h-7 w-20 rounded-3xl" />
        </div>
        <Skeleton className="mt-2 h-6 w-full rounded-md" />
        <Skeleton className="mt-2 h-4 w-4/5 rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-30 rounded-md" />
        <div className="mt-3 flex items-center gap-2">
          <Skeleton className="h-3.5 w-18 rounded-md" />
          <Skeleton className="h-3.5 w-18 rounded-md" />
        </div>
      </Section>

      <Section className="pb-2">
        <div className="grid grid-cols-4 gap-2 rounded-xl border border-grey-light/80 p-2 dark:border-grey-dark/80">
          <Skeleton className="h-13 rounded-lg" />
          <Skeleton className="h-13 rounded-lg" />
          <Skeleton className="h-13 rounded-lg" />
          <Skeleton className="h-13 rounded-lg" />
        </div>
      </Section>

      <Divider className="h-px bg-black/10 dark:bg-white/10" />

      <div className="sticky top-0 left-0 z-10 flex h-11 bg-side-main dark:bg-black">
        <div className="flex grow items-center justify-center border-b-2 border-grey-light dark:border-grey-dark">
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
        <div className="flex grow items-center justify-center border-b-2 border-transparent">
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
      </div>

      <Section>
        <Skeleton className="mb-3 h-5 w-20 rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
        </div>
      </Section>

      <Divider className="h-px bg-black/10 dark:bg-white/10" />

      <Section>
        <Skeleton className="mb-3 h-5 w-20 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
