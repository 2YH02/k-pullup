"use client";

import cn from "@lib/cn";

const buttonColorMap = {
  primary: cn(
    "bg-primary dark:bg-primary",
    "text-white",
    "disabled:bg-primary-subtle",
    "disabled:text-grey-dark"
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
    "border-primary dark:border-primary-light/50",
    "disabled:text-primary/50",
    "disabled:border-primary/50 dark:disabled:border-primary-light/30"
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
  sm: cn("text-[13px]", "py-2", "px-3.5"),
  md: cn("text-[14px]", "py-2.5", "px-5"),
  lg: cn("text-[15px]", "py-3", "px-6"),
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
    "inline-flex items-center justify-center rounded-xl font-semibold tracking-[-0.01em]",
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
