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
          "w-[55px] h-[55px] flex flex-col items-center justify-center rounded-md gap-1",
          className
        )}
        onClick={onClick}
        ref={ref}
        disabled={disabled}
      >
        <div>{icon}</div>
        {text && <Text typography="t7">{text}</Text>}
      </button>
    );
  }
);

export default IconButton;
