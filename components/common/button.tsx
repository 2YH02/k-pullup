"use client";

import cn from "@lib/cn";

const buttonColorMap = {
  primary: cn(
    "bg-primary dark:bg-primary-dark",
    "text-white",
    "disabled:bg-primary/50",
    "disabled:text-white/70"
  ),
  coral: cn(
    "bg-coral",
    "text-white",
    "disabled:bg-coral/50",
    "disabled:text-white/70"
  ),
  blue: cn(
    "bg-blue",
    "text-white",
    "disabled:bg-blue/50",
    "disabled:text-white/70"
  ),
  black: cn(
    "bg-black",
    "text-white",
    "disabled:bg-black/50",
    "disabled:text-white/70"
  ),
};

const buttonContrastColorMap = {
  primary: cn(
    "bg-white dark:bg-black-light",
    "text-primary dark:text-primary-light",
    "border",
    "border-primary dark:border-primary-dark",
    "disabled:text-primary/50",
    "disabled:border-primary/50 dark:disabled:border-primary-dark/50"
  ),
  coral: cn(
    "bg-white dark:bg-black-light",
    "text-coral dark:text-coral",
    "border",
    "border-coral dark:border-coral/65",
    "disabled:text-coral/50",
    "disabled:border-coral/50 dark:disabled:border-coral/35"
  ),
  blue: cn(
    "bg-white dark:bg-black-light",
    "text-blue dark:text-blue",
    "border",
    "border-blue dark:border-blue/65",
    "disabled:text-blue/50",
    "disabled:border-blue/50 dark:disabled:border-blue/35"
  ),
  black: cn(
    "bg-white dark:bg-black-light",
    "text-black dark:text-grey-light",
    "border",
    "border-black dark:border-grey-dark",
    "disabled:text-black/50 dark:disabled:text-grey/60",
    "disabled:border-black/50 dark:disabled:border-grey-dark/60"
  ),
};

const buttonSizeMap = {
  sm: cn("text-sm", "py-2", "px-3"),
  md: cn("text-base", "py-[10px]", "px-6"),
  lg: cn("text-lg", "py-3", "px-8"),
};

type ButtonColor = keyof typeof buttonColorMap;
type ButtonSize = keyof typeof buttonSizeMap;

export interface ButtonProps {
  /**
   * 버튼 색상
   */
  color?: ButtonColor;
  /**
   * 버튼 사이즈
   */
  size?: ButtonSize;
  /**
   * 버튼 배경 색상 유 / 무
   */
  variant?: "normal" | "contrast";
  /**
   * 넓이 최대
   */
  full?: boolean;
  /**
   * tailwind 스타일 클래스
   */
  className?: React.ComponentProps<"button">["className"];
  /**
   * 버튼 비활성화
   */
  disabled?: boolean;
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  children: React.ReactNode;
}

const Button = ({
  color = "primary",
  size = "md",
  variant,
  full,
  className,
  disabled,
  onClick,
  children,
}: ButtonProps) => {
  const colorClass =
    variant === "contrast"
      ? buttonContrastColorMap[color]
      : buttonColorMap[color];
  const sizeClass = buttonSizeMap[size];
  const fullClass = full ? "w-full" : "";

  const buttonClass = cn(
    colorClass,
    sizeClass,
    fullClass,
    "inline-flex items-center justify-center rounded-md font-medium",
    "select-none transition-[transform,background-color,border-color,box-shadow] duration-180 ease-out",
    "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/25",
    disabled
      ? "cursor-not-allowed"
      : "cursor-pointer active:scale-[0.99] active:bg-opacity-75"
  );

  return (
    <button
      className={cn(buttonClass, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
