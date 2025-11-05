"use client";

import CloseIcon from "@/components/icons/close-icon";
import Input from "@common/input";
import ArrowLeftIcon from "@icons/arrow-left-icon";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  value: string;
  referrer?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFn: VoidFunction;
  onEnter?: VoidFunction;
}

const SearchHeader = ({
  value,
  onChange,
  clearFn,
  onEnter,
}: SearchHeaderProps) => {
  const router = useRouter();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="mo:fixed sticky top-0 left-0 flex items-center justify-center w-full h-14 bg-white dark:bg-black py-3">
      <button className="px-3" onClick={() => router.push("/")}>
        <ArrowLeftIcon className="fill-black dark:fill-white" />
      </button>
      <div className="grow pr-4">
        <Input
          isInvalid={false}
          className="rounded-md border-grey-light"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="철봉 위치 주소로 검색"
          isFocus
          icon={<CloseIcon size={20} />}
          onIconClick={clearFn}
        />
      </div>
    </div>
  );
};

export default SearchHeader;
