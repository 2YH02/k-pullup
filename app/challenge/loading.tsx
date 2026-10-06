import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle="챌린지" withNav fullHeight deviceType={deviceType}>
      <div className="space-y-3 px-6 pb-8 pt-5">
        <div>
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="mt-2 h-6 w-48 rounded-md" />
          <Skeleton className="mt-2 h-3.5 w-64 max-w-full rounded-md" />
        </div>
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-36 w-full rounded-3xl" />
        <Skeleton className="h-60 w-full rounded-3xl" />
      </div>
    </SideMain>
  );
};

export default Loading;
