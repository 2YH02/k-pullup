"use client";

import SideMain from "@common/side-main";
import { useRouter } from "next/navigation";
import React from "react";
import ErrorPage from "./error-page";

interface Props extends React.ComponentProps<typeof SideMain> {
  errorTitle: string;
  prevUrl?: string;
  actionLabel?: string;
  actionUrl?: string;
}

const NotFound = ({
  errorTitle,
  actionLabel = "홈으로 가기",
  actionUrl = "/",
  ...props
}: Props) => {
  const router = useRouter();
  return (
    <ErrorPage
      icon="!"
      title="찾을 수 없어요"
      description={errorTitle}
      actionLabel={actionLabel}
      onAction={() => router.push(actionUrl)}
      {...props}
    />
  );
};

export default NotFound;
