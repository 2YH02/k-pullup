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
    <SideMain headerTitle="내가 등록한 위치" hasBackButton deviceType={deviceType}>
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="mt-1.5 h-4 w-44 rounded-md" />
        </div>
      </Section>

      <Section className="pt-2">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`locate-skeleton-${index}`}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-surface/80 px-3 py-2.5 dark:border-grey-dark dark:bg-black"
            >
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="grow">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="mt-1.5 h-3 w-1/2 rounded-md" />
              </div>
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
          ))}
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
