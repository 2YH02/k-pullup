import Section from "@common/section";
import SideMain from "@common/side-main";
import ResetPasswordForm from "@pages/reset-password/reset-password-form";
import SendPasswordForm from "@pages/reset-password/send-password-form";
import { headers } from "next/headers";

interface PageProps {
  searchParams: {
    token: string;
    email: string;
  };
}

const ResetPasswordPage = ({ searchParams }: PageProps) => {
  const { token, email } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <SideMain
      headerTitle="비밀번호 초기화"
      fullHeight
      hasBackButton
      referrer={!!referrer}
    >
      <Section>
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
