import Text from "@common/text";
import Section from "@common/section";
import SideMain from "@common/side-main";
import SigninForm from "@pages/signin/signin-form";
import Image from "next/image";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

const SigninPage = ({ searchParams }: PageProps) => {
  const { returnUrl } = searchParams;

  return (
    <SideMain headerTitle="로그인" fullHeight hasBackButton>
      <div className="w-full h-full flex flex-col justify-center">
        <Section className="flex flex-col items-center justify-center pb-0">
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
          <Text typography="t3" className="mt-3">
            대한민국 철봉 지도
          </Text>
        </Section>
        <Section className="px-9">
          <SigninForm returnUrl={returnUrl} />
        </Section>
      </div>
    </SideMain>
  );
};

export default SigninPage;
