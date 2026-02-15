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
    <SideMain headerTitle="즐겨찾기" hasBackButton deviceType={deviceType}>
      <Section className="pb-2">
        <div className="rounded-xl border border-yellow/35 bg-yellow/10 px-3 py-2 dark:border-yellow-dark/40 dark:bg-yellow-dark/10">
          <Skeleton className="h-4 w-56 rounded-md bg-yellow/20 dark:bg-yellow-dark/25" />
        </div>
      </Section>

      <section className="px-6 pb-6">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`bookmark-skeleton-${index}`}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-surface/80 px-3 py-2.5 dark:border-grey-dark dark:bg-black"
            >
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="grow">
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="mt-1.5 h-3 w-1/2 rounded-md" />
              </div>
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </SideMain>
  );
};

export default Loading;
