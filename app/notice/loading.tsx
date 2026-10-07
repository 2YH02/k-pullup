import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="공지사항"
      hasBackButton
      fullHeight
      deviceType={deviceType}
    >
      <div>
        <div className="sticky top-0 z-40 flex border-b border-primary/10 bg-side-main/95 px-4 pt-2 dark:border-grey-dark dark:bg-black/90">
          <Skeleton className="mx-1 h-10 flex-1 rounded-t-lg" />
          <Skeleton className="mx-1 h-10 flex-1 rounded-t-lg" />
          <Skeleton className="mx-1 h-10 flex-1 rounded-t-lg" />
        </div>

        <Section className="py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="mb-2.5 rounded-xl border border-primary/10 bg-search-input-bg/50 px-3.5 py-3 dark:border-grey-dark dark:bg-black/35"
            >
              <div className="flex min-h-12 w-full items-center gap-3">
                <div className="grow">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="mt-2 h-4 w-3/4 rounded-md" />
                  <Skeleton className="mt-1.5 h-3 w-20 rounded-md" />
                </div>
                <Skeleton className="size-5 rounded-full" />
              </div>
            </div>
          ))}
        </Section>
      </div>
    </SideMain>
  );
};

export default Loading;
