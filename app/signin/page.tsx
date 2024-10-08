import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { type Device } from "../mypage/page";

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

  const deviceType: Device = getDeviceType(userAgent as string);

  return (
    <SideMain
      headerTitle="로그인"
      fullHeight
      hasBackButton
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <Section className="flex flex-col items-center justify-start pb-0">
        <div className="w-36 h-36 rounded-3xl overflow-hidden">
          <Image
            src="/signinimg.webp"
            alt="로그인"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-full object-cover"
          />
        </div>
        <Text typography="t4" className="mt-3 mb-6">
          대한민국 철봉 지도
        </Text>

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/kakao`}
          className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#FFDB6D] flex items-center justify-center
          web:text-lg mb-4"
        >
          <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
            <img src="/kakao-logo.svg" alt="카카오 로고" className="" />
          </div>
          <div className="w-full text-center text-[#3D1200]">카카오 로그인</div>
        </Link>

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/naver`}
          className="w-[90%] min-w-[300px] h-12 rounded-lg bg-[#1FBB64] flex items-center justify-center
          web:text-lg text-white mb-4"
        >
          <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
            <img src="/naver-logo.svg" alt="네이버 로고" className="" />
          </div>
          <div className="w-full text-center text-white">네이버 로그인</div>
        </Link>

        <Link
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/auth/google`}
          className="w-[90%] min-w-[300px] h-12 rounded-lg bg-white flex items-center justify-center
          web:text-lg border border-solid border-grey"
          replace
        >
          <div className="absolute left-10 flex items-center justify-center w-12 h-12 shrink-0">
            <img src="/google-logo.svg" alt="구글 로고" className="" />
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
