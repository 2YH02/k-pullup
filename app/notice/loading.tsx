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
    <SideMain
      headerTitle="공지사항"
      hasBackButton
      fullHeight
      deviceType={deviceType}
    >
      <div>
        {/* 탭 영역 스켈레톤 */}
        <div className="sticky top-0 flex z-40 border-b border-solid border-grey-light dark:border-grey-dark">
          <Skeleton className="flex-1 h-10 rounded-none" />
          <Skeleton className="flex-1 h-10 rounded-none" />
          <Skeleton className="flex-1 h-10 rounded-none" />
        </div>

        {/* 리스트 항목 스켈레톤 */}
        <Section>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 p-2 border-2 border-solid border-grey-light/60 dark:border-grey-dark/40 rounded-md"
            >
              <div className="flex items-center w-full">
                <div className="grow space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/4 rounded-md" />
                </div>
                <Skeleton className="h-5 w-5 rounded-full ml-3" />
              </div>
            </div>
          ))}
        </Section>
      </div>
    </SideMain>
  );
};

export default Loading;
