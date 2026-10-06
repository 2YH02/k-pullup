import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="모먼트" fullHeight hasBackButton deviceType={deviceType}>
      <div className="px-6 pb-4 pt-5">
        <div className="rounded-2xl border border-primary/15 bg-search-input-bg/45 px-4 py-4 dark:border-white/10 dark:bg-black/30">
          <Skeleton className="h-5 w-56 rounded-md" />
          <Skeleton className="mt-2 h-3.5 w-64 rounded-md" />
        </div>
      </div>

      <div className="px-4">
        <Skeleton className="mb-2 h-5 w-32 rounded-md" />
        <div className="rounded-xl border border-location-badge-bg/85 bg-location-badge-bg/45 p-1.5 dark:border-location-badge-bg-dark/75 dark:bg-location-badge-bg-dark/30">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="mt-1.5 h-12 w-full rounded-lg" />
          <Skeleton className="mt-1.5 h-12 w-full rounded-lg" />
        </div>
      </div>

      <Section className="pt-4">
        <Skeleton className="mb-2 h-5 w-24 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      </Section>
    </SideMain>
  );
};

export default Loading;
