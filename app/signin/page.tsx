import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { type Device } from "../mypage/page";
import KakaoLoginButton from "@/components/pages/signin/kakao-login-button";

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
  const userAgent = headersList.get("user-agent");
  const safeReturnUrl =
    returnUrl && returnUrl.startsWith("/") ? returnUrl : "/";

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="로그인"
      fullHeight
      hasBackButton
      referrer={!!referrer}
      backFallbackUrl={safeReturnUrl}
      deviceType={deviceType}
    >
      <Section className="flex flex-col items-center justify-start pb-0">
        <div className="w-36 h-36 rounded-3xl overflow-hidden">
          <Image
            src="/logo.png"
            alt="로그인"
            width={164}
            height={164}
            className="w-full h-full object-cover"
          />
        </div>
        <Text typography="t4" className="mb-6">
          대한민국 철봉 지도
        </Text>

        <KakaoLoginButton />

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/naver`}
          className="w-[90%] min-w-75 h-12 rounded-lg bg-[#1FBB64] flex items-center justify-center
          web:text-lg text-white mb-4"
        >
          <div className="absolute left-10 flex items-center justify-center shrink-0">
            <Image src="/naver-logo.svg" alt="네이버 로고" width={48} height={48} />
          </div>
          <div className="w-full text-center text-white">네이버 로그인</div>
        </Link>

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}
          className="w-[90%] min-w-75 h-12 rounded-lg bg-white flex items-center justify-center
          web:text-lg border border-solid border-grey"
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
          className="mt-6"
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
