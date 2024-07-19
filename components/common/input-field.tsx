"use client";

import cn from "@lib/cn";
import {
  type FocusEventHandler,
  type InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import Input from "./input";
import Text from "./text";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  isError?: boolean;
  message?: React.ReactNode;
}

const InputField = forwardRef<HTMLInputElement, Props>(
  ({ label, isError, message = "", onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const labelColor = isError
      ? "text-red"
      : focused
      ? "text-primary-dark"
      : undefined;

    const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      setFocused(true);
      onFocus?.(e);
    };
    const handleBlue: FocusEventHandler<HTMLInputElement> = (e) => {
      setFocused(false);
      onBlur?.(e);
    };

    return (
      <div>
        {label && (
          <Text typography="t6" className={cn("mb-1", labelColor)}>
            {label}
          </Text>
        )}

        <Input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlue}
          isInvalid={isError || false}
          {...props}
        />

        <Text typography="t7" className={cn("mt-1", labelColor)}>
          {message}
        </Text>
      </div>
    );
  }
);

export default InputField;
