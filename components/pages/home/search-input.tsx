"use client";

import Input from "@common/input";
import Section from "@common/section";
import useDeviceType from "@hooks/useDeviceType";
import SearchIcon from "@icons/search-icon";
import cn from "@lib/cn";

const SearchInput = () => {
  const deviceType = useDeviceType();
  const style = deviceType === "ios-mobile-app" ? "mo:top-12" : "";

  return (
    <Section
      className={cn(
        "mo:bg-transparent mo:dark:bg-transparent mo:fixed mo:w-full mo:top-4 mo:left-1/2 mo:-translate-x-1/2 mo:py-0",
        style
      )}
    >
      <Input
        isInvalid={false}
        placeholder="검색"
        icon={<SearchIcon />}
        isSearchButton
        className="shadow"
      />
    </Section>
  );
};

export default SearchInput;