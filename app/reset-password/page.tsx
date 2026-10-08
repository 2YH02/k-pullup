import Section from "@common/section";
import SideMain from "@common/side-main";
import ResetPasswordForm from "@pages/reset-password/reset-password-form";
import SendPasswordForm from "@pages/reset-password/send-password-form";
import { headers } from "next/headers";
import getServerDeviceType from "@lib/get-server-device-type";
import isInternalReferrer from "@lib/is-internal-referrer";

interface PageProps {
  searchParams: {
    token: string;
    email: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "비밀번호 변경 - 대한민국 철봉 지도",
  };
};

const ResetPasswordPage = ({ searchParams }: PageProps) => {
  const { token, email } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const hasInternalReferrer = isInternalReferrer(referrer, headersList.get("host"));

  const deviceType = getServerDeviceType();

  return (
    <SideMain
      headerTitle="비밀번호 초기화"
      fullHeight
      hasBackButton
      referrer={hasInternalReferrer}
      deviceType={deviceType}
    >
        <Section className="pt-8">
        {token && email ? (
          <ResetPasswordForm token={token} />
        ) : (
          <SendPasswordForm />
        )}
      </Section>
    </SideMain>
  );
};

export default ResetPasswordPage;
