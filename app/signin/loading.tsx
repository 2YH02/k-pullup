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
      <Section className="flex flex-col items-center justify-start pb-0">
        <Skeleton className="h-36 w-36 rounded-3xl" />
        <Skeleton className="mt-3 mb-6 h-7 w-40 rounded-md" />

        <div className="mb-4 h-12 w-[90%] min-w-75 rounded-lg border border-yellow/35 bg-yellow/20 dark:border-yellow-dark/35 dark:bg-yellow-dark/20">
          <div className="flex h-full items-center px-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="mx-auto h-5 w-28 rounded-md" />
          </div>
        </div>

        <div className="mb-4 h-12 w-[90%] min-w-75 rounded-lg bg-[#1FBB64]">
          <div className="flex h-full items-center px-4">
            <Skeleton className="h-8 w-8 rounded-full bg-white/80" />
            <Skeleton className="mx-auto h-5 w-28 rounded-md bg-white/80" />
          </div>
        </div>

        <div className="h-12 w-[90%] min-w-75 rounded-lg border border-grey bg-white dark:border-grey-dark dark:bg-black-light">
          <div className="flex h-full items-center px-4">
            <Skeleton className="h-8 w-8 rounded-full bg-grey-light/90 dark:bg-grey-dark/80" />
            <Skeleton className="mx-auto h-5 w-28 rounded-md bg-grey-light/90 dark:bg-grey-dark/80" />
          </div>
        </div>

        <Skeleton className="mt-6 h-4 w-24 rounded-md" />
      </Section>
    </SideMain>
  );
};

export default Loading;
