import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="이메일 확인"
      fullHeight
      hasBackButton
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
      <Section className="flex h-full flex-col px-9 pt-10">
        <Skeleton className="h-5 w-28 rounded-md" />
        <Skeleton className="mt-2 h-10 w-full rounded-md bg-location-badge-bg/58 dark:bg-location-badge-bg-dark/38" />
        <Skeleton className="mt-2 h-3.5 w-36 rounded-md" />
        <div className="grow" />
        <Skeleton className="mb-2 h-11 w-full rounded-md" />
      </Section>
    </SideMain>
  );
};

export default Loading;
