"use client";

import Button from "@common/button";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import { useRouter } from "next/navigation";
import React from "react";

export interface ErrorPageProps extends React.ComponentProps<typeof SideMain> {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  onAction: VoidFunction;
  prevUrl?: string;
}

const ErrorPage = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  prevUrl,
  prevClick,
  ...props
}: ErrorPageProps) => {
  const router = useRouter();
  return (
    <SideMain
      prevClick={
        prevClick
          ? prevClick
          : () => {
              if (prevUrl) {
                router.push(prevUrl);
              } else {
                router.back();
              }
            }
      }
      {...props}
    >
      <Section className="mt-8">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center motion-safe:animate-page-enter">
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 dark:border-primary-dark/40 dark:bg-primary-dark/20">
            <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-primary/20 motion-safe:animate-pulse motion-reduce:animate-none dark:ring-primary-light/25" />
            <Text typography="t3" fontWeight="bold" className="text-primary dark:text-primary-light">
              {icon}
            </Text>
          </div>
          <Text
            display="block"
            textAlign="center"
            typography="t4"
            fontWeight="bold"
            className="mb-2 text-primary dark:text-primary-light"
          >
            {title}
          </Text>
          <Text
            display="block"
            textAlign="center"
            typography="t6"
            className="mb-5 text-grey-dark dark:text-grey"
          >
            {description}
          </Text>
          <Button onClick={onAction} full className="h-10 max-w-52">
            {actionLabel}
          </Button>
        </div>
      </Section>
    </SideMain>
  );
};

export default ErrorPage;
