import SignupClient from "./signup-client";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

const SignupPage = ({ searchParams }: PageProps) => {
  const { returnUrl } = searchParams;

  return (
    <>
      <SignupClient returnUrl={returnUrl} />
    </>
  );
};

export default SignupPage;
