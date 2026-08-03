import cn from "@lib/cn";
import { forwardRef } from "react";

interface TextareaProps {
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  value?: string;
  className?: React.ComponentProps<"textarea">["className"];
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      maxLength = 40,
      rows = 4,
      placeholder,
      value,
      onChange,
      disabled,
    },
    ref
  ) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full resize-none rounded-xl border border-text-on-surface-muted/40 bg-location-badge-bg/58 p-3 text-black transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-text-on-surface-muted/85 focus:border-primary/70 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-location-badge-bg-dark/90 dark:bg-location-badge-bg-dark/38 dark:text-white dark:placeholder:text-grey",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
