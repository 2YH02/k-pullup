import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";

const UserClientSkeleton = () => {
  return (
    <SideMain headerTitle="내 정보 관리" fullHeight hasBackButton>
      <Section>
        <Skeleton className="w-full h-21.5 mb-16" />
        <Skeleton className="w-full h-31.5" />
      </Section>
    </SideMain>
  );
};

export default UserClientSkeleton;
