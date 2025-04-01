"use client";

import { type SearchData } from "@/app/search/search-client";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";
import PinIcon from "@icons/pin-icon";
import { type KakaoPlace } from "@layout/move-map-input";
import useSearchStore from "@store/useSearchStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsPinMapFill } from "react-icons/bs";

interface SearchResultProps {
  result: SearchData[];
  kakaoSearchResult: KakaoPlace[];
}

const SearchList = ({ result, kakaoSearchResult }: SearchResultProps) => {
  const router = useRouter();

  const { addSearch } = useSearchStore();
  const { move } = useMapControl();

  if (result.length === 0 && kakaoSearchResult.length === 0) {
    return (
      <Section className="flex flex-col items-center">
        <Image
          src="/empty-search2.gif"
          alt="empty-search"
          width={300}
          height={100}
          className="mb-4"
        />
        <Text display="block" textAlign="center" fontWeight="bold">
          검색 결과가 존재하지 않습니다...
        </Text>
      </Section>
    );
  }

  return (
    <ul>
      {result.length > 0 && (
        <Text fontWeight="bold" className="px-4">
          철봉 위치
        </Text>
      )}

      {result.map((item, index) => {
        return (
          <li
            key={`${item.markerId ? item.markerId : item.address}-${index}`}
            className="border-b border-solid dark:border-grey-dark"
          >
            <button
              className="flex items-center p-2 px-4 text-left w-full h-full"
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
              <div className="w-[90%]">
                <Text typography="t6" className="break-all">
                  {highlightText(
                    removeMarkTags(item.address),
                    extractMarkedText(item.address).marked
                  )}
                </Text>
              </div>
              <GrowBox />
              <div className="shrink-0 w-[10%] flex items-center justify-center">
                <PinIcon />
              </div>
            </button>
          </li>
        );
      })}

      {kakaoSearchResult.length > 0 && (
        <Text fontWeight="bold" className="px-4 pt-4">
          지도 이동
        </Text>
      )}

      {kakaoSearchResult.map((item) => {
        return (
          <li
            key={item.id}
            className="border-b border-solid dark:border-grey-dark"
          >
            <button
              className="flex items-center p-2 px-4 text-left w-full h-full"
              onClick={() => {
                move({
                  lat: Number(item.y),
                  lng: Number(item.x),
                });
                addSearch({
                  addr: item.address_name,
                  place: item.place_name,
                  lat: item.y || null,
                  lng: item.x || null,
                });
              }}
            >
              <div className="w-[90%] flex flex-col">
                <Text typography="t6" className="break-all">
                  {item.address_name}
                </Text>
                <Text typography="t7" className="break-all text-grey">
                  {item.place_name}
                </Text>
              </div>
              <GrowBox />
              <div className="shrink-0 w-[10%] flex items-center justify-center">
                <BsPinMapFill className="fill-primary" />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export const extractMarkedText = (
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

export const highlightText = (
  text: string,
  highlights: string[]
): React.ReactNode => {
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

export const removeMarkTags = (input: string): string => {
  return input.replace(/<\/?mark>/g, "");
};

export default SearchList;
