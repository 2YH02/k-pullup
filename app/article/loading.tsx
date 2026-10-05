import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import getServerDeviceType from "@lib/get-server-device-type";

const Loading = () => {
  const deviceType = getServerDeviceType();

  return (
    <SideMain headerTitle=" " hasBackButton fullHeight deviceType={deviceType}>
      <Section>
        {/* 제목 영역 */}
        <Skeleton className="h-7 w-3/4 rounded-md" />
        {/* 메타 정보 */}
        <Skeleton className="mt-3 h-4 w-1/3 rounded-md" />
        {/* 콘텐츠 블록 ×5 */}
        <Skeleton className="mt-6 h-4 w-full rounded-md" />
        <Skeleton className="mt-3 h-4 w-full rounded-md" />
        <Skeleton className="mt-3 h-4 w-full rounded-md" />
        <Skeleton className="mt-3 h-4 w-5/6 rounded-md" />
        <Skeleton className="mt-6 h-4 w-full rounded-md" />
      </Section>
    </SideMain>
  );
};

export default Loading;
