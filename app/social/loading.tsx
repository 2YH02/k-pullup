import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="소셜" withNav fullHeight deviceType={deviceType} bodyStyle="pb-0">
      <Section className="pb-3 pt-5">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="mt-2 h-6 w-64 max-w-full rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-72 max-w-full rounded-md" />
      </Section>

      <Section className="pb-0">
        <SectionTitle title="모먼트" subTitle="최근 운동 기록" />
        <div className="flex gap-3 pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`social-moment-skeleton-${index}`} className="flex flex-col items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="mt-1 h-3 w-10 rounded-md" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle
          title="지역 커뮤니티"
          subTitle="가까운 사람들과 이야기해요."
        />
        <div className="flex w-full gap-3 overflow-x-scroll overflow-y-hidden px-1 py-1 scrollbar-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`social-chat-skeleton-${index}`}
              className="group flex h-22 w-58 shrink-0 items-center gap-3 rounded-2xl border border-primary/12 bg-side-main px-3 py-2.5 text-left"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="min-w-0 grow">
                <Skeleton
                  className={index === 0 ? "h-3.5 w-18 rounded-md" : "h-3.5 w-24 rounded-md"}
                />
                <Skeleton
                  className={index === 0 ? "mt-1.5 h-3 w-40 rounded-md" : "mt-1.5 h-3 w-36 rounded-md"}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle title="인기 철봉" subTitle="많이 찾는 장소" />
        <div className="mb-3 inline-flex rounded-full border border-primary/12 bg-side-main p-1 dark:border-white/10">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="ml-1 h-7 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </Section>

      <section className="mt-12 w-full border-t border-primary/12 px-4 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-3">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-4 w-56 rounded-md" />
        </div>
      </section>
    </SideMain>
  );
};

export default Loading;
