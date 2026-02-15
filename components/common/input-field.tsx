"use client";

import cn from "@lib/cn";
import {
  type FocusEventHandler,
  type InputHTMLAttributes,
  forwardRef,
  useId,
  useState,
} from "react";
import Input from "./input";
import Text from "./text";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * input label
   */
  label?: React.ReactNode;
  /**
   * 에러 확인
   */
  isError?: boolean;
  /**
   * 하단 메시지 출력
   */
  message?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, isError, message = "", onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const generatedId = useId();
    const fieldId = props.id || `input-field-${generatedId}`;

    const labelColorClass = isError
      ? "text-red dark:text-red"
      : focused
      ? "text-primary dark:text-primary-light"
      : "text-grey-dark dark:text-grey";

    const inputClassName = cn(
      "bg-location-badge-bg/58 dark:bg-location-badge-bg-dark/38 border-text-on-surface-muted/40 dark:border-location-badge-bg-dark/90 ring-1 ring-black/4 dark:ring-white/8 transition-[border-color,background-color,box-shadow] duration-150",
      focused && !isError
        ? "border-primary/70 dark:border-primary-dark/70 ring-2 ring-primary/18 dark:ring-primary-dark/24"
        : "",
      isError ? "border-red dark:border-red bg-red/5 dark:bg-red/10" : ""
    );

    const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={fieldId}>
            <Text typography="t6" className={cn("block", labelColorClass)}>
              {label}
            </Text>
          </label>
        )}

        <Input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          isInvalid={isError || false}
          id={fieldId}
          className={inputClassName}
          {...props}
        />

        <Text
          typography="t7"
          className={cn(
            "block min-h-4",
            isError ? "text-red dark:text-red" : "text-grey dark:text-grey"
          )}
        >
          {message}
        </Text>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
