import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="즐겨찾기" hasBackButton deviceType={deviceType}>
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <Skeleton className="h-3.5 w-16 rounded-md" />
          <Skeleton className="mt-2 h-6 w-20 rounded-md" />
          <Skeleton className="mt-3 h-1.5 w-full rounded-full" />
          <Skeleton className="mt-2 h-3.5 w-44 rounded-md" />
        </div>
      </Section>

      <section className="px-6 pb-6">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`bookmark-skeleton-${index}`}
              className="flex items-center gap-3 rounded-xl border border-primary/10 bg-search-input-bg/50 px-3 py-2.5 dark:border-grey-dark dark:bg-black/35"
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
