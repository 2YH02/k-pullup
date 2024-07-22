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
    <div>
      <Text className="p-2">{title}</Text>
      <ul className="bg-white dark:bg-black-light p-2">{children}</ul>
    </div>
  );
};

interface ListItemProps {
  title: string;
  description?: string;
  link?: boolean;
  url?: string;
  initValue?: boolean;
  onTrue: VoidFunction;
  onFalse: VoidFunction;
}

export const ListItem = ({
  title,
  description,
  link,
  url,
  initValue,
  onTrue,
  onFalse,
}: ListItemProps) => {
  const router = useRouter();
  return (
    <li
      className={`flex justify-between items-center ${
        link && url ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={
        link && url
          ? () => {
              router.push(url);
            }
          : undefined
      }
    >
      <div>
        <Text display="block">{title}</Text>
        <Text display="block" typography="t7" className="text-grey-dark">
          {description}
        </Text>
      </div>
      {link && url ? (
        <div>
          <ArrowRightIcon size={20} color="black" />
        </div>
      ) : (
        <ToggleButton onTrue={onTrue} onFalse={onFalse} initValue={initValue} />
      )}
    </li>
  );
};
export default List;
