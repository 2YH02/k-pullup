import myInfo, { type ContributionLevel } from "@api/user/myInfo";
import Divider from "@common/divider";
import Footer from "@common/footer";
import Section from "@common/section";
import ShadowBox from "@common/shadow-box";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ArrowRightIcon from "@icons/arrow-right-icon";
import getDeviceType from "@lib/get-device-type";
import LinkList from "@pages/mypage/link-list";
import UserInfo from "@pages/mypage/user-info";
import { cookies, headers } from "next/headers";
import Link from "next/link";

export type Device =
  | "android-mobile-app"
  | "ios-mobile-app"
  | "android-mobile-web"
  | "ios-mobile-web"
  | "desktop";

export const generateMetadata = () => {
  return {
    title: `대한민국 철봉 지도 | 마이 페이지`,
  };
};

const Mypage = async () => {
  const cookieStore = cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const headersList = headers();
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  const user = await myInfo(decodeCookie);

  const noUser = !user || user.error;

  return (
    <SideMain
      headerTitle="내 정보"
      fullHeight
      withNav
      deviceType={deviceType}
      bodyStyle="pb-0"
    >
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
          <UserInfo user={user} />
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

      {/* 기여 등급 */}
      {!noUser && (
        <Section>
          <div className="flex justify-center items-center p-4 bg-white shadow-full rounded dark:border dark:border-solid dark:border-grey-dark dark:bg-black">
            <div className="flex flex-col justify-center items-center relative">
              <div className="w-28">
                <img
                  src={getContributionLevelImage(user.contributionLevel)}
                  alt="등급"
                  draggable={false}
                />
              </div>
              <Text typography="t4" fontWeight="bold" className="mb-1">
                {user.contributionLevel}
              </Text>
              <Text typography="t6">
                정보 기여 점수{" "}
                <span className="text-primary font-bold">
                  {user.contributionCount || 0}
                </span>
                점
              </Text>
            </div>
          </div>
        </Section>
      )}

      {/* 링크 버튼 */}
      {!noUser && <LinkList isAdmin={user.chulbong} />}

      <Footer />
    </SideMain>
  );
};

const getContributionLevelImage = (level?: ContributionLevel) => {
  switch (level) {
    case "초보 운동자":
    case "운동 길잡이":
      return "/rank1.svg";
    case "철봉 탐험가":
    case "스트릿 워리어":
      return "/rank2.svg";
    case "피트니스 전도사":
    case "철봉 레인저":
      return "/rank3.svg";
    case "철봉 매버릭":
    case "거장":
      return "/rank4.svg";
    case "명인":
      return "/rank5.svg";
    default:
      return "/rank1.svg";
  }
};

export default Mypage;
