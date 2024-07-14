"use clinet";

import cn from "@lib/cn";

const buttonColorMap = {
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
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: "normal" | "contrast";
  full?: boolean;
  className?: string;
  disabled?: boolean;
  onClick: VoidFunction;
  children: React.ReactNode;
}

const Button = ({
  color = "coral",
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
    "rounded",
    "focus:outline-none",
    !disabled && "hover:bg-opacity-75"
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
