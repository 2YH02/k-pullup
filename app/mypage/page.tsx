import myInfo, { type ContributionLevel } from "@api/user/myInfo";
import Footer from "@common/footer";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import ArrowRightIcon from "@icons/arrow-right-icon";
import getDeviceType from "@lib/get-device-type";
import LinkList from "@pages/mypage/link-list";
import UserInfo from "@pages/mypage/user-info";
import { cookies, headers } from "next/headers";
import Image from "next/image";
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
      bodyStyle="pb-0 flex flex-col"
    >
      <Section>
        {noUser ? (
          <Link
            href="/signin?returnUrl=/mypage"
            className="group flex items-center justify-between rounded-xl border border-primary/10 bg-surface/80 px-4 py-3 transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-primary/8 active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-grey-dark dark:bg-black dark:web:hover:border-primary-dark dark:web:hover:bg-primary-dark/15"
          >
            <div>
              <Text fontWeight="bold" className="text-primary dark:text-primary-light">
                로그인 및 회원가입하기
              </Text>
              <Text typography="t6" className="text-grey-dark dark:text-grey">
                로그인하면 내 활동 정보를 확인할 수 있어요
              </Text>
            </div>
            <ArrowRightIcon
              size={20}
              className="transition-transform duration-180 ease-out group-hover:translate-x-px group-active:translate-x-px motion-reduce:transform-none motion-reduce:transition-none"
            />
          </Link>
        ) : (
            <UserInfo user={user} />
        )}
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-primary/10 bg-surface/70 p-1.5 dark:border-grey-dark dark:bg-black">
          <Link
            href={noUser ? "/signin?returnUrl=/mypage" : "/mypage/user"}
            className="rounded-lg border border-primary/10 bg-search-input-bg/50 px-2.5 py-2.5 text-center transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-search-input-bg active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-grey dark:web:hover:bg-black/45"
          >
            <Text typography="t6" className="font-semibold text-primary dark:text-primary-light">
              내 정보 관리
            </Text>
          </Link>
          <Link
            href="mypage/config"
            className="rounded-lg border border-primary/10 bg-search-input-bg/50 px-2.5 py-2.5 text-center transition-[transform,background-color,border-color] duration-180 ease-out web:hover:border-primary/20 web:hover:bg-search-input-bg active:scale-[0.99] motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-grey dark:web:hover:bg-black/45"
          >
            <Text typography="t6" className="font-semibold text-primary dark:text-primary-light">
              설정
            </Text>
          </Link>
        </div>
      </Section>

      {/* 기여 등급 */}
      {!noUser && (
        <Section>
          <div className="rounded-xl border border-primary/10 bg-surface/80 p-4 dark:border-grey-dark dark:bg-black">
            <div className="flex flex-col items-center">
              <Text typography="t6" className="mb-2 text-grey-dark dark:text-grey">
                기여 등급
              </Text>
              <div className="group relative mb-2">
                <div className="pointer-events-none absolute inset-2 -z-10 rounded-full bg-primary/10 blur-md transition-opacity duration-180 ease-out web:group-hover:opacity-100 motion-reduce:transition-none dark:bg-primary-light/10" />
                <div className="rounded-full border border-primary/10 bg-white/55 p-1.5 transition-transform duration-180 ease-out web:group-hover:scale-[1.02] motion-reduce:transform-none dark:border-grey-dark dark:bg-black-light">
                  <Image
                    src={getContributionLevelImage(user.contributionLevel)}
                    alt="등급"
                    draggable={false}
                    width={108}
                    height={108}
                    className="motion-safe:animate-page-enter motion-reduce:animate-none"
                  />
                </div>
              </div>
              <Text typography="t4" fontWeight="bold" className="mb-1 text-primary dark:text-primary-light">
                {user.contributionLevel}
              </Text>
              <Text typography="t6" className="text-grey-dark dark:text-grey">
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

      <GrowBox />
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
