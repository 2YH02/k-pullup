import myInfo from "@api/user/myInfo";
import Divider from "@common/divider";
import Section from "@common/section";
import ShadowBox from "@common/shadow-box";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ArrowRightIcon from "@icons/arrow-right-icon";
import LinkList from "@pages/mypage/link-list";
import { cookies } from "next/headers";
import Link from "next/link";
// TODO: 마커 등록 갯수, 수정 제안 횟수에 따른 UI 차별

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
            {(user.reportCount || user.markerCount) && (
              <div className="mt-3">
                {user.reportCount && (
                  <Text typography="t7" display="block">
                    정보 수정 제안 총{" "}
                    <span className="font-bold">{user.reportCount}</span>회
                  </Text>
                )}

                {user.markerCount && (
                  <Text typography="t7" display="block">
                    등록한 철봉 총{" "}
                    <span className="font-bold">{user.markerCount}</span>개
                  </Text>
                )}
              </div>
            )}
          </>
        )}
      </Section>

      <Section className="pt-0">
        <ShadowBox className="flex justify-between ">
          <Link
            href={noUser ? "/signin?returnUrl=/mypage" : "/mypage/user"}
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

      {!noUser && <LinkList isAdmin={user.chulbong} />}
    </SideMain>
  );
};
export default Mypage;
