import ShadowBox from "@/components/common/shadow-box";
import myInfo from "@api/user/myInfo";
import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ArrowRightIcon from "@icons/arrow-right-icon";
import { cookies } from "next/headers";
import Link from "next/link";
// TODO: 마이페이지 스타일 기능 완성

const Mypage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const user = await myInfo(decodeCookie);

  const noUser = !user || user.error;

  return (
    <SideMain headerTitle="내 정보" fullHeight withNav>
      <Section>
        {noUser ? (
          <>
            <Link
              href="/signin?returnUrl=/mypage"
              className="flex items-center justify-between p-2 hover:bg-primary hover:bg-opacity-20 rounded-md"
            >
              <Text fontWeight="bold" className="text-primary">
                로그인 및 회원가입하기
              </Text>
              <ArrowRightIcon size={20} />
            </Link>
          </>
        ) : (
          <>
            <div>
              <Text typography="t4" fontWeight="bold" className="mr-1">
                {user.username}
              </Text>
              <Text>님</Text>
            </div>
            <Text typography="t6">안녕하세요.</Text>
          </>
        )}
      </Section>
      <Section className="pt-0">
        <ShadowBox className="flex justify-between ">
          <Link
            href={noUser ? "/sigin?returnUrl=/mypage" : "/mypage/user"}
            className="w-1/2 rounded-lg p-1 text-center web:hover:bg-grey-light web:hover:dark:bg-grey-dark"
          >
            <Text>내 정보 관리</Text>
          </Link>
          <Divider orientation="vertical" className="w-[0.5px] mx-3" />
          <Link
            href="mypage/config"
            className="w-1/2 rounded-lg p-1 text-center web:hover:bg-grey-light web:hover:dark:bg-grey-dark"
          >
            <Text>설정</Text>
          </Link>
        </ShadowBox>
      </Section>
    </SideMain>
  );
};
export default Mypage;
