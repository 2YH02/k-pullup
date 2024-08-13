import Section from "@common/section";
import SideMain from "@common/side-main";
import SigninForm from "@pages/signin/signin-form";
import { headers } from "next/headers";

interface EmailPageProps {
  searchParams: {
    returnUrl: string;
  };
}

const EmailSigninPage = ({ searchParams }: EmailPageProps) => {
  const { returnUrl } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <SideMain
      headerTitle="로그인"
      fullHeight
      hasBackButton
      referrer={!!referrer}
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
