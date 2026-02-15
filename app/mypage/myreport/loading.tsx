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
    <SideMain headerTitle="받은 정보 수정 제안" hasBackButton fullHeight deviceType={deviceType}>
      <Section className="pb-2">
        <div className="rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 dark:border-grey-dark dark:bg-black">
          <Skeleton className="h-5 w-42 rounded-md" />
          <Skeleton className="mt-1.5 h-4 w-44 rounded-md" />
        </div>
      </Section>

      {Array.from({ length: 3 }).map((_, sectionIdx) => (
        <Section key={`myreport-group-${sectionIdx}`} className="py-2">
          <div className="rounded-xl border border-primary/10 bg-surface/80 p-3 dark:border-grey-dark dark:bg-black">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <Skeleton className="h-3 w-10 rounded-md" />
            </div>
            <div className="scrollbar-hidden flex gap-2 overflow-x-auto overflow-y-hidden py-1">
              {Array.from({ length: 2 }).map((__, cardIdx) => (
                <div
                  key={`myreport-card-${sectionIdx}-${cardIdx}`}
                  className="min-w-60 rounded-lg border border-primary/8 bg-search-input-bg/50 p-3 dark:border-grey-dark dark:bg-black/35"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-4 w-4 rounded-md" />
                  </div>
                  <Skeleton className="h-3.5 w-4/5 rounded-md" />
                  <Skeleton className="mt-1.5 h-3.5 w-3/5 rounded-md" />
                  <Skeleton className="mt-2 h-3 w-14 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </Section>
      ))}
    </SideMain>
  );
};

export default Loading;
