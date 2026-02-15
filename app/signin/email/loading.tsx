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
    <SideMain headerTitle="로그인" fullHeight hasBackButton deviceType={deviceType}>
      <div className="flex h-full w-full flex-col pt-10">
        <Section className="px-9">
          <div>
            <Skeleton className="mb-1 h-4 w-12 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md bg-location-badge-bg/58 dark:bg-location-badge-bg-dark/38" />
            <Skeleton className="mt-1 mb-2 h-3.5 w-32 rounded-md" />

            <Skeleton className="mb-1 h-4 w-16 rounded-md" />
            <Skeleton className="h-10 w-full rounded-md bg-location-badge-bg/58 dark:bg-location-badge-bg-dark/38" />
            <Skeleton className="mt-1 h-3.5 w-32 rounded-md" />
          </div>

          <div className="mt-3">
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-30 rounded-md" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
        </Section>
      </div>
    </SideMain>
  );
};

export default Loading;
