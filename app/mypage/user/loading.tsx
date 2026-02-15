import type { Device } from "@/app/mypage/page";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="내 정보 관리" fullHeight hasBackButton deviceType={deviceType}>
      <Section>
        <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
          <Skeleton className="mx-auto h-4 w-44 rounded-md" />
        </div>
      </Section>

      <Section className="pt-0">
        <SectionTitle title="개인 정보" />
        <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
            <div className="flex items-center gap-2 border-t border-primary/10 pt-3 dark:border-grey-dark">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
              <div className="grow" />
              <Skeleton className="h-7 w-14 rounded-md" />
            </div>
          </div>
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
