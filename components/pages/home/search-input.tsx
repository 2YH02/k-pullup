"use client";

import { type Device } from "@/app/mypage/page";
import Input from "@common/input";
import Section from "@common/section";
import cn from "@lib/cn";
import { BsSearch } from "react-icons/bs";

const SearchInput = ({ deviceType = "desktop" }: { deviceType?: Device }) => {
  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";
  const style = isMobileApp ? "mo:top-12" : "";

  return (
    <Section
      className={cn(
        "mo:bg-transparent mo:dark:bg-transparent mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0",
        style
      )}
    >
      <Input
        isInvalid={false}
        placeholder="철봉 주소 검색"
        icon={<BsSearch size={20} className="fill-[#555] dark:fill-grey-light" />}
        isSearchButton
        className="shadow-sm border-grey-light"
      />
    </Section>
  );
};

export default SearchInput;
