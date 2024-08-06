"use client";

import Input from "@common/input";
import ArrowLeftIcon from "@icons/arrow-left-icon";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchHeader = ({ value, onChange }: SearchHeaderProps) => {
  const router = useRouter();

  return (
    <div className="sticky top-0 left-0 flex items-center justify-center bg-white dark:bg-black py-3">
      <button className="px-3" onClick={() => router.back()}>
        <ArrowLeftIcon className="fill-black dark:fill-white" />
      </button>
      <div className="grow pr-4">
        <Input
          isInvalid={false}
          className="rounded-md"
          value={value}
          onChange={onChange}
          placeholder="철봉 위치 주소로 검색"
          isFocus
        />
      </div>
    </div>
  );
};

export default SearchHeader;
