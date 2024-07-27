import Section from "@common/section";
import SideMain from "@common/side-main";
import ResetPasswordForm from "@pages/reset-password/reset-password-form";
import SendPasswordForm from "@pages/reset-password/send-password-form";

interface PageProps {
  searchParams: {
    token: string;
    email: string;
  };
}

const ResetPasswordPage = ({ searchParams }: PageProps) => {
  const { token, email } = searchParams;

  return (
    <SideMain headerTitle="비밀번호 초기화" fullHeight hasBackButton>
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
