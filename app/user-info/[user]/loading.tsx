import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain
      hasBackButton
      headerTitle="사용자 프로필"
      fullHeight
      deviceType={deviceType}
    >
      <Section className="pb-3 pt-5">
        <div className="rounded-2xl border border-primary/12 bg-search-input-bg/45 p-4 dark:border-white/10 dark:bg-black/30">
          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-6 w-32 rounded-md" />
              <Skeleton className="mt-2 h-3.5 w-28 rounded-md" />
            </div>
          </div>
          <div className="mt-4 border-t border-primary/10 pt-3 dark:border-white/10">
            <Skeleton className="h-3.5 w-16 rounded-md" />
            <Skeleton className="mt-2 h-6 w-12 rounded-md" />
          </div>
        </div>
      </Section>

      <Section className="pb-2 pt-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="mt-2 h-3.5 w-52 rounded-md" />
      </Section>

      <div className="px-6 pb-6 pt-2">
        <ul className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-18 w-full rounded-xl" />
            </li>
          ))}
        </ul>
      </div>
    </SideMain>
  );
};

export default Loading;
