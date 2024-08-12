"use client";

import { type SearchData } from "@/app/search/search-client";
import Text from "@common/text";
import SearchIcon from "@icons/search-icon";
import useSearchStore from "@store/useSearchStore";
import { useRouter } from "next/navigation";

interface SearchResultProps {
  result: SearchData[];
  value: string;
}

const SearchList = ({ result, value }: SearchResultProps) => {
  const router = useRouter();
  const { addSearch } = useSearchStore();

  return (
    <ul>
      {result
        .filter((item) =>
          item.address.toLowerCase().includes(value.toLowerCase())
        )
        .map((item, index) => (
          <li
            key={`${item.markerId ? item.markerId : item.address}-${index}`}
            className="border-b border-solid dark:border-grey-dark"
          >
            <button
              className="flex items-center p-3 text-left w-full h-full"
              onClick={() => {
                addSearch({
                  addr: item.address,
                  d: item.markerId || null,
                  lat: item.position?.lat || null,
                  lng: item.position?.lng || null,
                });
                const url = !!item.markerId
                  ? `/pullup/${item.markerId}`
                  : `/search?addr=${item.address}&lat=${item.position?.lat}&lng=${item.position?.lng}`;
                router.push(url);
              }}
            >
              <div className="mr-3">
                <SearchIcon size={20} className="fill-black dark:fill-white" />
              </div>
              <Text>{highlightText(item.address, value)}</Text>
            </button>
          </li>
        ))}
    </ul>
  );
};

const highlightText = (text: string, highlight: string): React.ReactNode => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <Text key={index} className="text-primary-dark dark:text-primary-dark">
        {part}
      </Text>
    ) : (
      part
    )
  );
};

export default SearchList;
