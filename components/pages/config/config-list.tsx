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
    <section className="mb-4 px-6">
      <Text
        typography="t6"
        fontWeight="bold"
        className="mb-2 text-grey-dark dark:text-grey"
      >
        {title}
      </Text>
      <ul className="overflow-hidden rounded-xl border border-primary/10 bg-surface/80 dark:border-grey-dark dark:bg-black">
        {children}
      </ul>
    </section>
  );
};

const handleEnterOrSpace = (
  e: React.KeyboardEvent<HTMLLIElement>,
  onPress?: VoidFunction
) => {
  if (!onPress) return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onPress();
  }
};

const ItemArrow = () => {
  return (
    <span className="text-grey-dark transition-transform duration-180 ease-out group-hover:translate-x-px dark:text-grey motion-reduce:transform-none">
      <ArrowRightIcon size={18} color="primary" />
    </span>
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

  const isClickable = Boolean((link && url) || onClick);
  const handleItemClick =
    link && url
      ? () => {
          router.push(url);
        }
      : onClick;

  return (
    <li
      className={`group flex min-h-12 items-center justify-between gap-3 border-b border-primary/10 px-3 py-2.5 last:border-b-0 dark:border-grey-dark ${
        isClickable
          ? "cursor-pointer transition-[background-color,transform] duration-150 ease-out web:hover:bg-primary/6 active:scale-[0.998] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 dark:web:hover:bg-primary-dark/15"
          : "cursor-default"
      }`}
      onClick={handleItemClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => handleEnterOrSpace(e, handleItemClick)}
    >
      <div className="min-w-0">
        <Text display="block">{title}</Text>
        {description && (
          <Text
            display="block"
            typography="t7"
            className="mt-0.5 text-grey-dark dark:text-grey"
          >
            {description}
          </Text>
        )}
      </div>

      {link && url && <ItemArrow />}
      {onTrue && onFalse && (
        <ToggleButton onTrue={onTrue} onFalse={onFalse} initValue={initValue} />
      )}
      {onClick && <ItemArrow />}
    </li>
  );
};

export default List;
