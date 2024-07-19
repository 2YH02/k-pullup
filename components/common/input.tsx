"use client";

import { useRouter } from "next/navigation";

interface InputProps extends React.ComponentProps<"input"> {
  isInvalid: boolean;
  icon?: React.ReactNode;
  onIconClick?: VoidFunction;
  isSearchButton?: boolean;
}
// TODO: Input 컴포넌트 스토리 추가
// TODO: Input field 컴포넌트, 스토리 추가

const Input = ({
  isInvalid,
  icon,
  onIconClick,
  isSearchButton = false,
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
    <div className="relative w-full">
      <input
        className={`h-10 w-full px-4 pr-10 text-base font-medium border border-primary rounded-3xl focus:outline-none focus:border-primary-dark ${
          isInvalid ? "border-red" : ""
        } dark:bg-grey-dark dark:border-grey dark:focus:border-grey-light dark:text-white ${
          isSearchButton ? "cursor-pointer focus:" : ""
        }`}
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
