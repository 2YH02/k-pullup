import { type Device } from "@/app/mypage/page";
import Section from "@common/section";
import SideMain from "@common/side-main";
import getDeviceType from "@lib/get-device-type";
import SigninForm from "@pages/signin/signin-form";
import { headers } from "next/headers";
import LoginButton from "../login-button";

interface EmailPageProps {
  searchParams: {
    returnUrl: string;
  };
}

const EmailSigninPage = ({ searchParams }: EmailPageProps) => {
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
      <div className="w-full h-full flex flex-col pt-10">
        <Section className="px-9">
          <SigninForm returnUrl={returnUrl} />
        </Section>
        <LoginButton />
      </div>
    </SideMain>
  );
};

export default EmailSigninPage;
