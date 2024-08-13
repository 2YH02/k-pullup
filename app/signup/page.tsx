import { headers } from "next/headers";
import SignupClient from "./signup-client";

interface PageProps {
  searchParams: {
    returnUrl: string;
  };
}

const SignupPage = ({ searchParams }: PageProps) => {
  const { returnUrl } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");

  return (
    <>
      <SignupClient returnUrl={returnUrl} referrer={!!referrer} />
    </>
  );
};

export default SignupPage;
