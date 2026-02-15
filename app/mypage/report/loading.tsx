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
    <SideMain headerTitle="내 정보 수정 제안" hasBackButton fullHeight deviceType={deviceType}>
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="mt-1.5 h-4 w-44 rounded-md" />
        </div>
      </Section>

      <Section className="pt-2">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`report-skeleton-${index}`}
              className="rounded-xl border border-primary/10 bg-surface/80 p-3 dark:border-grey-dark dark:bg-black"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="mt-1.5 h-4 w-24 rounded-md" />
                </div>
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <Skeleton className="mt-1.5 h-4 w-3/4 rounded-md" />
              <Skeleton className="mt-3 h-28 w-full rounded-lg" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-9 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
