import { Device } from "@/app/mypage/page";
import SideMain from "@common/side-main";
import LoadingIcon from "@icons/loading-icon";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const PageLoading = ({
  fullHeight = false,
  withNav = true,
}: {
  fullHeight?: boolean;
  withNav?: boolean;
}) => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);
  return (
    <SideMain
      headerTitle=" "
      fullHeight={fullHeight}
      withNav={withNav}
      deviceType={deviceType}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadingIcon className="m-0" />
      </div>
    </SideMain>
  );
};

export default PageLoading;
