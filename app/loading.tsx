import type { Device } from "./mypage/page";
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
    <SideMain withNav deviceType={deviceType} bodyStyle="pb-0">
      <Section className="py-2 sticky top-0 z-20 bg-surface/92 dark:bg-black/55 backdrop-blur-sm">
        <div className="flex h-10 items-center justify-between">
          <div className="w-2/3">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="mt-1 h-3.5 w-40 rounded-md max-[370px]:hidden" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </Section>

      <Section className="py-0">
        <Skeleton className="h-12 w-full rounded-2xl" />
      </Section>

      <Section className="pb-0">
        <SectionTitle title="모먼트" subTitle="지금 이 순간을 기록해보세요." />
        <div className="flex gap-3 pb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`moment-skeleton-${index}`} className="flex flex-col items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="mt-1 h-3 w-10 rounded-md" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle title="내 주변 철봉" subTitle="현재 위치 기준 2km" />
        <div className="flex gap-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={`around-skeleton-${index}`} className="w-64 shrink-0 rounded-2xl border border-primary/10 bg-side-main p-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="mt-3 h-4 w-3/4 rounded-md" />
              <Skeleton className="mt-2 h-3 w-1/3 rounded-md" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle title="최근 추가된 이미지" />
        <div className="columns-2 gap-3 [column-fill:balance]">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton
              key={`image-skeleton-${index}`}
              className="mb-3 w-full break-inside-avoid rounded-2xl"
              style={{ height: index % 2 === 0 ? "160px" : "220px" }}
            />
          ))}
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
