"use client";

import Text from "@common/text";
import ToggleButton from "@common/toggle-button";
import ArrowRightIcon from "@icons/arrow-right-icon";
import { useRouter } from "next/navigation";

interface ListProps {
  title: string;
  children?: React.ReactNode;
}

const List = ({ title, children }: ListProps) => {
  return (
    <div className="mb-3">
      <Text className="p-2">{title}</Text>
      <ul className="bg-white dark:bg-black-light">{children}</ul>
    </div>
  );
};

interface ListItemProps {
  title: string;
  description?: string;
  link?: boolean;
  url?: string;
  initValue?: boolean;
  onClick?: VoidFunction;
  onTrue?: VoidFunction;
  onFalse?: VoidFunction;
}

export const ListItem = ({
  title,
  description,
  link,
  url,
  initValue,
  onClick,
  onTrue,
  onFalse,
}: ListItemProps) => {
  const router = useRouter();
  return (
    <li
      className={`flex justify-between items-center ${
        (link && url) || onClick ? "cursor-pointer" : "cursor-default"
      } p-2 border-b border-solid border-grey-light`}
      onClick={
        link && url
          ? () => {
              router.push(url);
            }
          : onClick
          ? onClick
          : undefined
      }
    >
      <div>
        <Text display="block">{title}</Text>
        <Text display="block" typography="t7" className="text-grey-dark">
          {description}
        </Text>
      </div>

      {link && url && (
        <div>
          <ArrowRightIcon size={20} color="black" />
        </div>
      )}
      {onTrue && onFalse && (
        <ToggleButton onTrue={onTrue} onFalse={onFalse} initValue={initValue} />
      )}
      {onClick && (
        <div>
          <ArrowRightIcon size={20} color="black" />
        </div>
      )}
    </li>
  );
};
export default List;
