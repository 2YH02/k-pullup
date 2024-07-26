"use client";

import Text from "@common/text";
import { useState } from "react";
// TODO: 리스트 아이템 이름 카드로 변경
// TODO: props as 추가 (리스트, 버튼, default = div)

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
        className={`flex items-center shadow-sm w-full h-full px-3 py-6 mb-4 rounded-md bg-primary-light dark:bg-stone-700 ${
          hover ? "web:opacity-75" : ""
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
        <Text fontWeight="bold" typography="t5" className="break-all text-black-light">
          {title}
        </Text>
        <Text typography="t7" className="break-all text-grey-dark dark:text-grey">
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
