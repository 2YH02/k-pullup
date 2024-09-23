"use client";

import { type SearchData } from "@/app/search/search-client";
import Text from "@common/text";
import SearchIcon from "@icons/search-icon";
import useSearchStore from "@store/useSearchStore";
import { useRouter } from "next/navigation";

interface SearchResultProps {
  result: SearchData[];
}

const SearchList = ({ result }: SearchResultProps) => {
  const router = useRouter();
  const { addSearch } = useSearchStore();

  return (
    <ul>
      {result.map((item, index) => {
        return (
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
              <Text>
                {highlightText(
                  removeMarkTags(item.address),
                  extractMarkedText(item.address).marked
                )}
              </Text>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

const extractMarkedText = (
  input: string
): { marked: string[]; unmarked: string } => {
  const markRegex = /<mark>(.*?)<\/mark>/g;
  let marked: string[] = [];
  let unmarked = input.replace(markRegex, (_, p1) => {
    marked.push(p1);
    return "";
  });

  return {
    marked,
    unmarked,
  };
};

const highlightText = (text: string, highlights: string[]): React.ReactNode => {
  const regex = new RegExp(`(${highlights.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    highlights.some(
      (highlight) => part.toLowerCase() === highlight.toLowerCase()
    ) ? (
      <span key={index} className="text-primary-dark dark:text-primary-dark">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const removeMarkTags = (input: string): string => {
  return input.replace(/<\/?mark>/g, "");
};

export default SearchList;
