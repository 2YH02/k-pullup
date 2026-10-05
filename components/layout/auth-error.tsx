"use client";

import SideMain from "@common/side-main";
import { useRouter } from "next/navigation";
import React from "react";
import ErrorPage from "./error-page";

interface Props extends React.ComponentProps<typeof SideMain> {
  errorTitle: string;
  prevUrl?: string;
  returnUrl?: string;
}

const AuthError = ({ errorTitle, returnUrl, ...props }: Props) => {
  const router = useRouter();
  return (
    <ErrorPage
      icon="?"
      title="로그인이 필요해요"
      description={errorTitle}
      actionLabel="로그인하러 가기"
      onAction={() =>
        router.push(
          returnUrl
            ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}`
            : "/signin"
        )
      }
      hasBackButton
      {...props}
    />
  );
};

export default AuthError;
