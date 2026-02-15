import type { Device } from "@/app/mypage/page";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";

const Loading = () => {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain headerTitle="챌린지" withNav fullHeight deviceType={deviceType}>
      <section className="px-6 pt-10 pb-6">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-primary/14 bg-side-main p-6 dark:border-white/12 dark:bg-black/30">
          <Skeleton className="mx-auto mb-4 h-14 w-14 rounded-2xl" />
          <Skeleton className="mx-auto h-7 w-36 rounded-md" />
          <Skeleton className="mx-auto mt-3 h-4 w-56 rounded-md" />
          <Skeleton className="mx-auto mt-2 h-4 w-40 rounded-md" />
          <Skeleton className="mx-auto mt-6 h-10 w-30 rounded-full" />
        </div>
      </section>

      <section className="px-6 pb-6">
        <Skeleton className="h-60 w-full rounded-2xl" />
      </section>
    </SideMain>
  );
};

export default Loading;
