import Section from "@common/section";
import SideMain from "@common/side-main";
import SigninForm from "@pages/signin/signin-form";
import { headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";

interface EmailPageProps {
  searchParams: {
    returnUrl: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "로그인 - 대한민국 철봉 지도",
  };
};

const EmailSigninPage = ({ searchParams }: EmailPageProps) => {
  const { returnUrl } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");

  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="로그인"
      fullHeight
      hasBackButton
      referrer={!!referrer}
      deviceType={deviceType}
    >
      <div className="w-full h-full flex flex-col pt-10">
        <Section className="px-9">
          <SigninForm returnUrl={returnUrl} />
        </Section>
      </div>
    </SideMain>
  );
};

export default EmailSigninPage;
