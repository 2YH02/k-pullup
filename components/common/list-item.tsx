"use client";

import Text from "@common/text";
import { useState } from "react";

interface ListItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: VoidFunction;
}

const ListItem = ({ children, icon, onClick }: ListItemProps) => {
  const [hover, setHover] = useState(false);

  const Container = onClick ? "button" : "div";

  return (
    <li>
      <Container
        className={`flex items-center shadow-simple p-4 ${
          onClick ? "w-full" : ""
        } rounded-lg border border-solid 
          border-grey-light dark:border-none dark:bg-black-light mb-4 ${
            hover ? "web:shadow-simple-primary" : ""
          }`}
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {children}

        {icon && <div className="flex-shrink-0">{icon}</div>}
      </Container>
    </li>
  );
};

export const ListContents = ({
  children,
  title,
  subTitle,
}: {
  children?: React.ReactNode;
  title?: string;
  subTitle?: string;
}) => {
  return (
    <div className="flex grow">
      {children}
      <div className="flex flex-col">
        <Text
          fontWeight="bold"
          typography="t5"
          className="break-all text-black-light"
        >
          {title}
        </Text>
        <Text
          typography="t7"
          className="break-all text-grey-dark dark:text-grey"
        >
          {subTitle}
        </Text>
      </div>
    </div>
  );
};

export const ListLeft = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-shrink-0 mr-3">{children}</div>;
};

export const ListRight = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-shrink-0 mr-2">{children}</div>;
};

export default ListItem;
