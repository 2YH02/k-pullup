"use client";

import Skeleton from "@/components/common/skeleton";
import Text from "@/components/common/text";
import EditIcon from "@/components/icons/edit-icon";
import Section, { SectionTitle } from "@common/section";
import ShadowBox from "@common/shadow-box";
import SideMain from "@common/side-main";
import useUserStore from "@store/useUserStore";

const UserClient = () => {
  const { user } = useUserStore();

  if (!user || user.error) {
    return (
      <SideMain headerTitle="내 정보 관리" fullHeight hasBackButton>
        <Section>
          <Skeleton className="w-full h-[86px] mb-16" />
          <Skeleton className="w-full h-[126px]" />
        </Section>
      </SideMain>
    );
  }

  console.log(user);
  return (
    <SideMain headerTitle="내 정보 관리" fullHeight hasBackButton>
      <Section>
        <ShadowBox className="p-4">
          <div className="flex items-center justify-center mb-2">
            <Text className="mr-3">user name</Text>
            <EditIcon size={17} color="black" />
          </div>
          <Text display="block" textAlign="center" typography="t6">
            email@email.com
          </Text>
        </ShadowBox>
      </Section>

      <Section>
        <SectionTitle title="개인 정보" />
        <ShadowBox className="p-4">
          <div className="py-1">
            <Text typography="t6" className="w-1/4">
              아이디
            </Text>
            <Text typography="t6" className="w-3/4">
              email@email.com
            </Text>
          </div>
          <div className="py-1">
            <Text typography="t6" className="w-1/4">
              이메일
            </Text>
            <Text typography="t6" className="w-3/4">
              email@email.com
            </Text>
          </div>
          <div className="flex py-1">
            <Text typography="t6" className="w-1/4">
              비밀번호
            </Text>
            <Text typography="t6" className="w-2/4 grow">
              ***********
            </Text>
            <EditIcon size={17} color="black" />
          </div>
        </ShadowBox>
      </Section>
    </SideMain>
  );
};

export default UserClient;
