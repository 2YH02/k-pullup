"use client";

import { type SearchData } from "@/app/search/search-client";
import GrowBox from "@common/grow-box";
import Section from "@common/section";
import Text from "@common/text";
import useMapControl from "@hooks/useMapControl";
import PinIcon from "@icons/pin-icon";
import { type KakaoPlace } from "@layout/move-map-input";
import useSearchStore from "@store/useSearchStore";
import useSheetHeightStore from "@store/useSheetHeightStore";
import { useRouter } from "next/navigation";
import { BsPinMapFill } from "react-icons/bs";

interface SearchResultProps {
  result: SearchData[];
  kakaoSearchResult: KakaoPlace[];
  isSearching?: boolean;
}

const SearchList = ({
  result,
  kakaoSearchResult,
  isSearching = false,
}: SearchResultProps) => {
  const router = useRouter();

  const { addSearch } = useSearchStore();
  const { move } = useMapControl();
  const { sheetHeight, setCurHeight } = useSheetHeightStore();

  // Show loading skeleton
  if (isSearching) {
    return (
      <Section>
        <div className="space-y-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 px-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-grey-light dark:bg-grey-dark rounded-sm w-3/4"></div>
                <div className="h-3 bg-grey-light dark:bg-grey-dark rounded-sm w-1/2"></div>
              </div>
              <div className="w-6 h-6 bg-grey-light dark:bg-grey-dark rounded-full"></div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  // Show empty state
  if (result.length === 0 && kakaoSearchResult.length === 0) {
    return (
      <Section className="pt-4">
        <div className="relative isolate overflow-hidden flex flex-col items-center justify-center py-10 px-4 rounded-2xl border border-white/70 dark:border-white/10 bg-search-input-bg/55 dark:bg-black/25 backdrop-blur-sm">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/35 via-transparent to-primary/10 dark:from-white/8 dark:to-primary-dark/20"
          />

          <div className="relative mb-5 h-24 w-24 flex items-center justify-center">
            <span className="absolute h-24 w-24 rounded-full border border-primary/25 dark:border-primary-light/20 animate-ping motion-reduce:animate-none" />
            <span className="absolute h-16 w-16 rounded-full border border-primary/35 dark:border-primary-light/28 animate-pulse" />
            <span className="relative h-11 w-11 rounded-full border border-white/70 dark:border-white/10 bg-white/55 dark:bg-white/8 flex items-center justify-center">
              <PinIcon size={18} />
            </span>
          </div>

          <Text
            display="block"
            textAlign="center"
            fontWeight="bold"
            className="relative text-text-on-surface dark:text-grey-light mb-1"
          >
            검색 결과가 없습니다
          </Text>
          <Text
            typography="t6"
            display="block"
            textAlign="center"
            className="relative text-text-on-surface-muted dark:text-grey"
          >
            키워드를 조금 더 넓게 입력해 보세요
          </Text>
        </div>
      </Section>
    );
  }

  const totalResults = result.length + kakaoSearchResult.length;

  return (
    <>
      <Section className="pt-2 pb-1">
        <Text typography="t6" className="text-grey dark:text-grey">
          총 {totalResults}개의 검색 결과
        </Text>
      </Section>
      <ul>
        {result.length > 0 && (
          <Text fontWeight="bold" className="px-4 pb-2">
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
                  setCurHeight(sheetHeight.STEP_1.height);
                }}
              >
                <div className="w-[90%] flex flex-col">
                  <Text typography="t6" className="break-all">
                    {item.address_name}
                  </Text>
                  <Text
                    typography="t7"
                    className="break-all text-grey dark:text-grey"
                  >
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
    </>
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
  if (!highlights || highlights.length === 0) return text;

  // Escape special regex characters and create pattern
  const escapedHighlights = highlights
    .filter((h) => h && h.trim())
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (escapedHighlights.length === 0) return text;

  const regex = new RegExp(`(${escapedHighlights.join("|")})`, "gi");
  const parts = text.split(regex);

  // Pre-compute lowercase highlights for faster comparison
  const lowerHighlights = highlights.map((h) => h.toLowerCase());

  return parts.map((part, index) => {
    const isHighlight = lowerHighlights.includes(part.toLowerCase());
    return isHighlight ? (
      <span key={index} className="text-primary-dark dark:text-primary-dark">
        {part}
      </span>
    ) : (
      part
    );
  });
};

export const removeMarkTags = (input: string): string => {
  return input.replace(/<\/?mark>/g, "");
};

export default SearchList;
