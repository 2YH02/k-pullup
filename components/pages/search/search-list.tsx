"use client";

import { type SearchData } from "@/app/search/search-client";
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
      <Section className="pt-3">
        <div className="space-y-2 rounded-2xl border border-white/70 dark:border-white/10 bg-search-input-bg/55 dark:bg-black/25 p-3 backdrop-blur-sm">
          <div className="h-4 w-28 rounded-full bg-grey-light dark:bg-grey-dark animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 animate-pulse"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-grey-light dark:bg-grey-dark rounded-sm w-3/4" />
                <div className="h-3 bg-grey-light dark:bg-grey-dark rounded-sm w-1/2" />
              </div>
              <div className="w-8 h-8 bg-grey-light dark:bg-grey-dark rounded-full" />
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
      <Section className="pt-2 pb-2">
        <div className="relative isolate overflow-hidden rounded-2xl border border-white/70 dark:border-white/10 bg-search-input-bg/60 dark:bg-black/25 backdrop-blur-sm p-3">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/35 via-transparent to-primary/10 dark:from-white/8 dark:to-primary-dark/20"
          />
          <div className="relative flex items-center justify-between">
            <Text typography="t6" className="text-text-on-surface dark:text-grey-light" fontWeight="bold">
              총 {totalResults}개의 검색 결과
            </Text>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full px-2 py-1 text-[11px] leading-none font-medium border border-white/65 dark:border-white/10 bg-white/55 dark:bg-white/6 text-text-on-surface-muted dark:text-grey-light">
                철봉 {result.length}
              </span>
              <span className="rounded-full px-2 py-1 text-[11px] leading-none font-medium border border-white/65 dark:border-white/10 bg-white/55 dark:bg-white/6 text-text-on-surface-muted dark:text-grey-light">
                이동 {kakaoSearchResult.length}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {result.length > 0 && (
        <Section className="pt-1 pb-2">
          <Text
            fontWeight="bold"
            className="mb-2 text-text-on-surface dark:text-grey-light"
          >
            철봉 위치
          </Text>
          <ul className="space-y-2">
            {result.map((item, index) => {
              return (
                <li key={`${item.markerId ? item.markerId : item.address}-${index}`}>
                  <button
                    type="button"
                    className="relative isolate overflow-hidden flex items-center gap-3 w-full text-left rounded-xl border border-white/70 dark:border-white/10 bg-search-input-bg/55 dark:bg-black/25 backdrop-blur-sm p-3 transition-all duration-180 ease-out motion-reduce:transition-none hover:border-primary/45 dark:hover:border-primary-light/35 hover:shadow-[0_8px_18px_rgba(64,64,56,0.12)] dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
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
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/32 via-transparent to-primary/10 dark:from-white/8 dark:to-primary-dark/18"
                    />
                    <div className="relative shrink-0 h-10 w-10 rounded-full border border-white/45 dark:border-white/10 bg-white/45 dark:bg-white/7 flex items-center justify-center">
                      <PinIcon />
                    </div>
                    <div className="relative min-w-0 flex-1">
                      <Text typography="t6" className="break-all text-text-on-surface dark:text-grey-light">
                        {highlightText(
                          removeMarkTags(item.address),
                          extractMarkedText(item.address).marked
                        )}
                      </Text>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {kakaoSearchResult.length > 0 && (
        <Section className="pt-1">
          <Text
            fontWeight="bold"
            className="mb-2 text-text-on-surface dark:text-grey-light"
          >
            지도 이동
          </Text>
          <ul className="space-y-2">
            {kakaoSearchResult.map((item) => {
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="relative isolate overflow-hidden flex items-center gap-3 w-full text-left rounded-xl border border-white/70 dark:border-white/10 bg-search-input-bg/55 dark:bg-black/25 backdrop-blur-sm p-3 transition-all duration-180 ease-out motion-reduce:transition-none hover:border-primary/45 dark:hover:border-primary-light/35 hover:shadow-[0_8px_18px_rgba(64,64,56,0.12)] dark:hover:shadow-[0_8px_18px_rgba(0,0,0,0.3)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
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
                    <div
                      aria-hidden
                      className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/32 via-transparent to-primary/10 dark:from-white/8 dark:to-primary-dark/18"
                    />
                    <div className="relative shrink-0 h-10 w-10 rounded-full border border-white/45 dark:border-white/10 bg-white/45 dark:bg-white/7 flex items-center justify-center">
                      <BsPinMapFill className="fill-primary dark:fill-primary-light" />
                    </div>
                    <div className="relative min-w-0 flex-1 flex flex-col">
                      <Text typography="t6" className="break-all text-text-on-surface dark:text-grey-light">
                        {item.address_name}
                      </Text>
                      <Text
                        typography="t7"
                        className="break-all text-text-on-surface-muted dark:text-grey mt-0.5"
                      >
                        {item.place_name}
                      </Text>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}
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
      <span
        key={index}
        className="text-primary-dark dark:text-primary-light font-semibold"
      >
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
