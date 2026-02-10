"use clinet";

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
    "bg-white dark:bg-black",
    "text-primary",
    "border",
    "border-primary",
    "disabled:text-primary/50",
    "disabled:border-primary/50"
  ),
  coral: cn(
    "bg-white",
    "text-coral",
    "border",
    "border-coral",
    "disabled:text-coral/50",
    "disabled:border-coral/50"
  ),
  blue: cn(
    "bg-white",
    "text-blue",
    "border",
    "border-blue",
    "disabled:text-blue/50",
    "disabled:border-blue/50"
  ),
  black: cn(
    "bg-white",
    "text-black",
    "border",
    "border-black",
    "disabled:text-black/50",
    "disabled:border-black/50"
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
  className?: React.ComponentProps<"div">["className"];
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
    "rounded-sm",
    "focus:outline-hidden select-none",
    !disabled && "active:bg-opacity-75"
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
