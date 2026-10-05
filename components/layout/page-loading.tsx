import Skeleton from "@common/skeleton";
import SideMain from "@common/side-main";
import getServerDeviceType from "@lib/get-server-device-type";

const PageLoading = ({
  fullHeight = false,
  withNav = true,
}: {
  fullHeight?: boolean;
  withNav?: boolean;
}) => {

  const deviceType = getServerDeviceType();
  return (
    <SideMain
      headerTitle=" "
      fullHeight={fullHeight}
      withNav={withNav}
      deviceType={deviceType}
    >
      <div className="p-4 space-y-4">
        {/* 헤더 플레이스홀더 */}
        <Skeleton className="h-5 w-2/5 rounded-md" />
        {/* 콘텐츠 플레이스홀더 */}
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-3/4 rounded-md" />
      </div>
    </SideMain>
  );
};

export default PageLoading;
