"use client";

import cn from "@lib/cn";
import { useRouter } from "next/navigation";

interface InputProps extends React.ComponentProps<"input"> {
  /**
   * 유효성 검사
   */
  isInvalid: boolean;
  /**
   * icon 추가
   */
  icon?: React.ReactNode;
  /**
   * icon 클릭 함수
   */
  onIconClick?: VoidFunction;
  /**
   * true일 때 클릭 시 /search 페이지로 이동
   */
  isSearchButton?: boolean;
  /**
   * tailwind 스타일 클래스
   */
  className?: string;
}

const Input = ({
  isInvalid,
  icon,
  onIconClick,
  isSearchButton = false,
  className,
  ...props
}: InputProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (isSearchButton) {
      router.push("/search");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.blur();
  };

  return (
    <div
      className={cn(
        `relative w-full rounded-3xl overflow-hidden h-10 px-4 pr-10 text-base font-medium border-2
        bg-white dark:bg-black-light border-primary ${
          isInvalid ? "border-red dark:border-red" : "dark:border-grey"
        } ${isSearchButton ? "cursor-pointer" : ""}`,
        className
      )}
    >
      <input
        className={`w-full h-full focus:outline-none focus:border-primary-dark ${
          isSearchButton ? "cursor-pointer" : ""
        } dark:bg-black-light dark:focus:border-grey-light text-black dark:text-white`}
        aria-invalid={isInvalid}
        onClick={isSearchButton ? handleClick : undefined}
        onFocus={isSearchButton ? handleFocus : undefined}
        {...props}
      />
      {icon && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={isSearchButton ? handleClick : onIconClick}
        >
          {icon}
        </button>
      )}
    </div>
  );
};

export default Input;
