import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="비밀번호 초기화"
      fullHeight
      hasBackButton
      deviceType={deviceType}
    >
      <Section className="pt-8">
        <div className="mt-4 rounded-2xl border border-primary/10 bg-search-input-bg/45 p-4 dark:border-grey-dark dark:bg-black/30">
          <Skeleton className="h-4 w-4/5 rounded-md" />
          <Skeleton className="mt-2 h-4 w-3/5 rounded-md" />
        </div>
        <Skeleton className="mt-5 h-4 w-32 rounded-md" />
        <Skeleton className="mt-2 h-10 w-full rounded-md bg-location-badge-bg/58 dark:bg-location-badge-bg-dark/38" />
        <Skeleton className="mt-2 h-11 w-28 rounded-md" />
      </Section>
    </SideMain>
  );
};

export default Loading;
