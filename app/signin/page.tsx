import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import KakaoLoginButton from "@/components/pages/signin/kakao-login-button";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "로그인 - 대한민국 철봉 지도",
  };
};

const SigninPage = ({ searchParams }: PageProps) => {
  const { returnUrl } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const hasInternalReferrer = isInternalReferrer(referrer, headersList.get("host"));
  const safeReturnUrl =
    returnUrl && returnUrl.startsWith("/") && !returnUrl.startsWith("//")
      ? returnUrl
      : "/";

  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="로그인"
      fullHeight
      hasBackButton
      referrer={hasInternalReferrer}
      backFallbackUrl={safeReturnUrl}
      deviceType={deviceType}
    >
      <Section className="flex flex-col items-center justify-start pb-6 pt-8">
        <div className="h-28 w-28 overflow-hidden rounded-3xl border border-primary/10 shadow-xs dark:border-grey-dark">
          <Image
            src="/logo.png"
            alt="로그인"
            width={164}
            height={164}
            className="w-full h-full object-cover"
          />
        </div>
        <Text typography="t4" fontWeight="bold" className="mb-7 mt-3 text-primary dark:text-primary-light">
          대한민국 철봉 지도
        </Text>

        <KakaoLoginButton />

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/naver`}
          className="relative mb-3 flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-[#1FBB64] text-white transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transition-none"
        >
          <div className="absolute left-10 flex items-center justify-center shrink-0">
            <Image src="/naver-logo.svg" alt="네이버 로고" width={48} height={48} />
          </div>
          <div className="w-full text-center text-white">네이버 로그인</div>
        </Link>

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}
          className="relative flex h-12 w-full max-w-sm items-center justify-center rounded-xl border border-grey bg-white transition-[transform,background-color] duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 motion-reduce:transition-none dark:border-grey-dark dark:bg-black-light"
          replace
        >
          <div className="absolute left-10 flex items-center justify-center shrink-0">
            <Image src="/google-logo.svg" alt="구글 로고" width={48} height={48} />
          </div>
          <div className="w-full text-center text-black">구글 로그인</div>
        </Link>

        <Link
          href={
            returnUrl ? `/signin/email?returnUrl=${returnUrl}` : "/signin/email"
          }
          className="mt-7 rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
        >
          <Text typography="t6" className="hover:underline">
            이메일로 로그인
          </Text>
        </Link>
      </Section>
    </SideMain>
  );
};

export default SigninPage;
