import cn from "@lib/cn";
import Text from "./text";
import { forwardRef } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  text?: React.ReactNode;
  className?: React.ComponentProps<"button">["className"];
  disabled?: boolean;
  onClick?: VoidFunction;
}

const IconButton = forwardRef(
  (
    { icon, text, className, disabled, onClick }: IconButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={cn(
          "group h-13.75 w-13.75 flex flex-col items-center justify-center rounded-lg gap-1.5 text-text-on-surface dark:text-grey-light transition-[background-color,transform,color] duration-150 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 disabled:opacity-45 disabled:cursor-not-allowed",
          className
        )}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
      >
        <div className="transition-transform duration-150 group-active:translate-y-px">
          {icon}
        </div>
        {text && (
          <Text
            typography="t7"
            className="select-none whitespace-nowrap text-inherit mo:text-[11px]"
          >
            {text}
          </Text>
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
