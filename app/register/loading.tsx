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
      headerTitle="위치 선택"
      hasBackButton
      withNav
      dragable={false}
      bodyStyle={deviceType === "ios-mobile-app" ? "pb-0 mo:pb-0 mb-24" : "pb-0 mo:pb-0 mb-2"}
      deviceType={deviceType}
    >
      <Section className="flex h-full flex-col pb-0 pt-0">
        <div className="flex flex-col items-center web:mt-8">
          <Skeleton className="mt-3 h-32.5 w-32.5 rounded-full" />

          <div className="mt-8 w-full rounded-xl border border-location-badge-bg/80 bg-location-badge-bg/45 px-3.5 py-3 dark:border-location-badge-bg-dark/70 dark:bg-location-badge-bg-dark/35">
            <Skeleton className="h-5 w-full rounded-md" />
          </div>

          <div className="mt-3 flex w-full items-start rounded-lg border border-yellow/35 bg-yellow/10 px-2.5 py-2 dark:border-yellow-dark/45 dark:bg-yellow-dark/10">
            <Skeleton className="h-4 w-full rounded-md" />
          </div>
        </div>

        <div className="grow" />
        <Skeleton className="mb-2 h-11 w-full rounded-md" />
      </Section>
    </SideMain>
  );
};

export default Loading;
