import type { Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import cn from "@lib/cn";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);
  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  return (
    <SideMain className={cn(isMobileApp ? "pt-12" : "")} deviceType={deviceType}>
      <div className="mo:fixed sticky top-0 left-0 z-40 flex items-center justify-center w-full h-14 bg-white/45 dark:bg-black/45 backdrop-blur-[2px] py-3">
        <div className="px-3">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="grow pr-4">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      <div className="page-transition">
        <Section>
          <Skeleton className="mb-4 h-4 w-48 rounded-md" />
          <button
            type="button"
            aria-label="검색 로딩 카드"
            className={cn(
              "w-full rounded-2xl border border-white/70 dark:border-white/10",
              "bg-search-input-bg/70 dark:bg-black/35 p-4"
            )}
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="mt-2 h-3 w-44 rounded-md" />
              </div>
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>
          </button>
        </Section>

        <Section className="pt-0">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>

          <ul
            className={cn(
              "rounded-2xl overflow-hidden border",
              "border-white/70 dark:border-white/10",
              "bg-search-input-bg/55 dark:bg-black/25"
            )}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <li
                key={`search-loading-item-${index}`}
                className="flex items-center border-b border-white/60 dark:border-white/8 px-4 py-3.5 last:border-b-0"
              >
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="mt-2 h-3 w-1/2 rounded-md" />
                </div>
                <Skeleton className="h-5 w-5 rounded-md" />
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </SideMain>
  );
};

export default Loading;
