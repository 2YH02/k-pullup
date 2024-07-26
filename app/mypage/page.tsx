import myInfo from "@api/user/myInfo";
import Divider from "@common/divider";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { cookies } from "next/headers";
import Link from "next/link";
// TODO: 마이페이지 스타일 기능 완성

const Mypage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const user = await myInfo(decodeCookie);

  if (user.error) {
    return (
      <SideMain headerTitle="내 정보" fullHeight withNav>
        <Link href="/signin" className="border border-solid border-red p-4">
          로그인 및 회원가입하기
        </Link>
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle="내 정보" fullHeight withNav>
      <Section>
        <div>
          <Text typography="t4" fontWeight="bold" className="mr-1">
            {user.username}
          </Text>
          <Text>님</Text>
        </div>
        <Text typography="t6">안녕하세요.</Text>
      </Section>
      <Section className="pt-0">
        <div className="flex justify-between shadow-simple p-1 rounded-lg border border-solid border-grey-light dark:border-none dark:bg-black-light">
          <Link
            href="mypage/user"
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
        </div>
      </Section>
    </SideMain>
  );
};

export default Mypage;
