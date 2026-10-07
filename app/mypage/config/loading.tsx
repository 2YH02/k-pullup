import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="설정" fullHeight hasBackButton deviceType={deviceType}>
      <section className="mb-5 px-6 pt-1">
        <Skeleton className="mb-2 h-4 w-16 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/50 dark:border-grey-dark dark:bg-black/35">
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <div>
              <Skeleton className="h-4 w-18 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-44 rounded-md" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </section>

      <section className="mb-5 px-6">
        <Skeleton className="mb-2 h-4 w-20 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/50 dark:border-grey-dark dark:bg-black/35">
          <div className="flex min-h-12 items-center justify-between border-b border-primary/10 px-3 py-2.5 dark:border-grey-dark">
            <div>
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-48 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
          <div className="flex min-h-12 items-center justify-between border-b border-primary/10 px-3 py-2.5 dark:border-grey-dark">
            <div>
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-40 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <div>
              <Skeleton className="h-4 w-18 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-52 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
        </div>
      </section>

      <section className="mb-5 px-6">
        <Skeleton className="mb-2 h-4 w-10 rounded-md" />
        <div className="overflow-hidden rounded-xl border border-primary/10 bg-search-input-bg/50 dark:border-grey-dark dark:bg-black/35">
          <div className="flex min-h-12 items-center justify-between px-3 py-2.5">
            <div>
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="mt-1.5 h-3 w-48 rounded-md" />
            </div>
            <Skeleton className="h-4 w-4 rounded-md" />
          </div>
        </div>
      </section>
    </SideMain>
  );
};

export default Loading;
