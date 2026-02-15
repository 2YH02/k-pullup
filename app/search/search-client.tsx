"use client";

import cn from "@/lib/cn";
import search from "@api/search/search";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import useMapControl from "@hooks/useMapControl";
import ArrowRightIcon from "@icons/arrow-right-icon";
import LocationIcon from "@icons/location-icon";
import type { KakaoPlace } from "@layout/move-map-input";
import SearchHeader from "@pages/search/search-header";
import SearchList, {
  extractMarkedText,
  highlightText,
  removeMarkTags,
} from "@pages/search/search-list";
import useSearchStore from "@store/useSearchStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { type Device } from "../mypage/page";

export interface SearchData {
  address: string;
  markerId?: number;
  position?: { lat: string; lng: string };
}

const SearchClient = ({
  isInternal,
  deviceType = "desktop",
  isEntryFromHome = false,
}: {
  isInternal?: boolean;
  deviceType?: Device;
  isEntryFromHome?: boolean;
}) => {
  const router = useRouter();

  const searchValue = useInput("");

  const { searches, clearSearches, removeItem } = useSearchStore();
  const { move } = useMapControl();

  const [result, setResult] = useState<SearchData[]>([]);
  const [kakaoSearchData, setKakaoSearchData] = useState<KakaoPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  useEffect(() => {
    const images = ["/empty-search.gif"];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // Clear results immediately when search is empty
    if (searchValue.value === "") {
      setResult([]);
      setKakaoSearchData([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Create AbortController to cancel previous requests
    const abortController = new AbortController();

    // Debounce both searches together
    const searchHandler = setTimeout(async () => {
      try {
        // Run both searches in parallel
        const [markerSearchResult, kakaoSearchResult] =
          await Promise.allSettled([
            // Marker search
            search(searchValue.value),
            // Kakao places search
            new Promise<KakaoPlace[]>((resolve, reject) => {
              const ps = new window.kakao.maps.services.Places();
              ps.keywordSearch(
                searchValue.value,
                (data: KakaoPlace[], status: string) => {
                  if (status === window.kakao.maps.services.Status.OK) {
                    resolve(data);
                  } else {
                    resolve([]);
                  }
                }
              );
            }),
          ]);

        // Only update state if not aborted
        if (!abortController.signal.aborted) {
          // Handle marker search results
          if (markerSearchResult.status === "fulfilled") {
            const markerData = markerSearchResult.value;
            if (!markerData.error && !markerData.message) {
              setResult(markerData.markers || []);
            } else {
              setResult([]);
            }
          } else {
            setResult([]);
          }

          // Handle Kakao search results
          if (kakaoSearchResult.status === "fulfilled") {
            setKakaoSearchData(kakaoSearchResult.value);
          } else {
            setKakaoSearchData([]);
          }

          setIsSearching(false);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setResult([]);
          setKakaoSearchData([]);
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(searchHandler);
      abortController.abort(); // Cancel pending operations
    };
  }, [searchValue.value]);

  const handleEnterKey = () => {
    // Navigate to first result on Enter key
    if (result.length > 0) {
      const firstResult = result[0];
      if (firstResult.markerId) {
        router.push(`/pullup/${firstResult.markerId}`);
      } else if (firstResult.position) {
        router.push(
          `/search?addr=${firstResult.address}&lat=${firstResult.position.lat}&lng=${firstResult.position.lng}`
        );
      }
    } else if (kakaoSearchData.length > 0) {
      const firstKakao = kakaoSearchData[0];
      move({
        lat: Number(firstKakao.y),
        lng: Number(firstKakao.x),
      });
    }
  };

  return (
    <SideMain className={cn(isMobileApp ? "pt-12" : "")}>
      <SearchHeader
        value={searchValue.value}
        onChange={searchValue.onChange}
        isInternal={!!isInternal}
        isEntryFromHome={isEntryFromHome}
        clearFn={() => searchValue.resetValue()}
        onEnter={handleEnterKey}
      />

      {searchValue.value.length > 0 ? (
        <SearchList
          result={result}
          kakaoSearchResult={kakaoSearchData}
          isSearching={isSearching}
        />
      ) : (
        <>
          <Section>
            <Text
              className="mb-4 text-text-on-surface-muted dark:text-grey-light"
              typography="t6"
              display="block"
              fontWeight="bold"
            >
              원하는 주소에 철봉이 있는지 확인해 보세요.
            </Text>

            {/* Around Search Card */}
            <button
              type="button"
              onClick={() => router.push("/search/around")}
              aria-label="주변 검색 페이지로 이동"
              className={cn(
                "relative isolate overflow-hidden",
                "w-full p-4 rounded-2xl border border-white/70 dark:border-white/10",
                "bg-search-input-bg/70 dark:bg-black/35 backdrop-blur-md",
                "shadow-[0_8px_24px_rgba(64,64,56,0.08)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.28)]",
                "flex items-center gap-3 text-left group",
                "transition-[transform,box-shadow,border-color] duration-180 ease-out motion-reduce:transition-none",
                "hover:border-primary/45 dark:hover:border-primary-light/35",
                "hover:shadow-[0_12px_28px_rgba(64,64,56,0.14)] dark:hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)]",
                "active:scale-[0.99] active:border-primary/60 dark:active:border-primary-light/40",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-side-main dark:focus-visible:ring-offset-black"
              )}
            >
              <div
                aria-hidden
                className={cn(
                  "absolute inset-0 pointer-events-none",
                  "bg-linear-to-br from-white/35 via-transparent to-primary/10",
                  "dark:from-white/10 dark:to-primary-dark/25"
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "absolute -top-10 -left-8 h-28 w-28 rounded-full blur-2xl pointer-events-none",
                  "bg-primary/20 dark:bg-primary-light/15",
                  "transition-transform duration-220 ease-out motion-reduce:transition-none",
                  "group-hover:translate-x-1 group-hover:-translate-y-1"
                )}
              />

              <div className="relative shrink-0 w-12 h-12 rounded-full border border-white/45 dark:border-white/10 bg-white/35 dark:bg-white/5 flex items-center justify-center transition-transform duration-180 ease-out motion-reduce:transition-none group-hover:scale-[1.03] group-hover:-translate-y-0.5">
                <LocationIcon size={24} color="primary" />
              </div>
              <div className="relative flex-1">
                <Text
                  typography="t5"
                  fontWeight="bold"
                  display="block"
                  className="mb-1 text-text-on-surface dark:text-grey-light"
                >
                  주변 검색
                </Text>
                <Text
                  typography="t7"
                  className="text-text-on-surface-muted dark:text-grey"
                >
                  지도를 움직여 원하는 위치 주변의 철봉을 찾아보세요
                </Text>
              </div>

              <div className="relative shrink-0 text-primary dark:text-primary-light transition-transform duration-180 ease-out motion-reduce:transition-none group-hover:translate-x-1">
                <ArrowRightIcon className="fill-primary dark:fill-primary-light" />
              </div>
            </button>
          </Section>

          {searches.length > 0 ? (
            <Section>
              <div className="flex justify-between items-center">
                <SectionTitle title="최근 검색" />
                <button
                  type="button"
                  onClick={() => clearSearches()}
                  aria-label="최근 검색 전체 삭제"
                  className={cn(
                    "rounded-full px-3 py-1.5",
                    "bg-search-input-bg/70 dark:bg-white/5",
                    "border border-white/70 dark:border-white/10",
                    "transition-all duration-180 ease-out motion-reduce:transition-none",
                    "hover:border-primary/40 dark:hover:border-primary-light/35",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
                  )}
                >
                  <Text
                    typography="t6"
                    className="text-text-on-surface-muted dark:text-grey-light"
                  >
                    목록 전체 삭제
                  </Text>
                </button>
              </div>

              <ul
                className={cn(
                  "mt-3 rounded-2xl overflow-hidden",
                  "border border-white/70 dark:border-white/10",
                  "bg-search-input-bg/55 dark:bg-black/25",
                  "backdrop-blur-sm"
                )}
              >
                {searches.slice(0, visibleCount).map((search, index) => {
                  return (
                    <li
                      key={`${search}-${index}`}
                      className={cn(
                        "group flex border-b border-white/60 dark:border-white/8 last:border-b-0",
                        "transition-colors duration-180 ease-out"
                      )}
                    >
                      <button
                        className={cn(
                          "w-full h-full text-left flex items-center py-3.5 px-4",
                          "transition-colors duration-180 ease-out motion-reduce:transition-none",
                          "hover:bg-white/55 dark:hover:bg-white/5",
                          "active:bg-white/70 dark:active:bg-white/8",
                          "focus-visible:outline-none focus-visible:bg-white/65 dark:focus-visible:bg-white/8"
                        )}
                        onClick={() => {
                          if (search.d) {
                            router.push(`/pullup/${search.d}`);
                          } else {
                            move({
                              lat: Number(search.lat),
                              lng: Number(search.lng),
                            });
                          }
                        }}
                      >
                        <div className="flex flex-col">
                          <Text
                            typography="t6"
                            className="break-all text-text-on-surface dark:text-grey-light"
                          >
                            {highlightText(
                              removeMarkTags(search.addr as string),
                              extractMarkedText(search.addr as string).marked
                            )}
                          </Text>
                          {search.place && (
                            <Text
                              typography="t7"
                              className="mt-0.5 break-all text-text-on-surface-muted dark:text-grey"
                            >
                              {search.place}
                            </Text>
                          )}
                        </div>
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "mx-2 my-auto shrink-0 rounded-full p-2",
                          "text-text-on-surface-muted dark:text-grey-light",
                          "transition-all duration-180 ease-out motion-reduce:transition-none",
                          "hover:bg-white/60 dark:hover:bg-white/8",
                          "active:scale-[0.94]",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
                        )}
                        onClick={() => removeItem(search.addr as string)}
                        aria-label="최근 검색 삭제"
                      >
                        <BsXLg className="fill-current" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {searches.length > visibleCount && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  aria-label="최근 검색 더보기"
                  className={cn(
                    "w-full mt-3 py-2.5 rounded-xl",
                    "border border-white/70 dark:border-white/10",
                    "bg-search-input-bg/70 dark:bg-white/5",
                    "text-text-on-surface-muted dark:text-grey-light",
                    "transition-all duration-180 ease-out motion-reduce:transition-none",
                    "hover:border-primary/45 dark:hover:border-primary-light/35 hover:bg-white/50 dark:hover:bg-white/8",
                    "active:scale-[0.99]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:focus-visible:ring-primary-light/35"
                  )}
                >
                  <Text typography="t6" className="text-text-on-surface-muted dark:text-grey-light">
                    더보기
                  </Text>
                </button>
              )}
            </Section>
          ) : (
            <Section>
              <SectionTitle title="검색 팁" />
              <div
                className={cn(
                  "relative isolate overflow-hidden mt-3 rounded-2xl p-3 space-y-2.5",
                  "border border-white/70 dark:border-white/10",
                  "bg-search-input-bg/55 dark:bg-black/25",
                  "backdrop-blur-sm"
                )}
              >
                <div
                  aria-hidden
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    "bg-linear-to-br from-white/35 via-transparent to-primary/10",
                    "dark:from-white/8 dark:to-primary-dark/18"
                  )}
                />
                <div className="flex gap-2.5 rounded-xl p-2.5 transition-colors duration-180 ease-out hover:bg-white/45 dark:hover:bg-white/5">
                  <Text
                    typography="t6"
                    className={cn(
                      "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                      "bg-primary/12 dark:bg-primary-light/20",
                      "text-primary dark:text-primary-light font-bold"
                    )}
                  >
                    1
                  </Text>
                  <Text
                    typography="t6"
                    className="relative text-text-on-surface-muted dark:text-grey"
                  >
                    동, 구, 시 단위로 검색하면 더 정확한 결과를 얻을 수 있어요
                  </Text>
                </div>
                <div className="flex gap-2.5 rounded-xl p-2.5 transition-colors duration-180 ease-out hover:bg-white/45 dark:hover:bg-white/5">
                  <Text
                    typography="t6"
                    className={cn(
                      "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                      "bg-primary/12 dark:bg-primary-light/20",
                      "text-primary dark:text-primary-light font-bold"
                    )}
                  >
                    2
                  </Text>
                  <Text
                    typography="t6"
                    className="relative text-text-on-surface-muted dark:text-grey"
                  >
                    건물명이나 공원 이름으로도 검색할 수 있어요
                  </Text>
                </div>
                <div className="flex gap-2.5 rounded-xl p-2.5 transition-colors duration-180 ease-out hover:bg-white/45 dark:hover:bg-white/5">
                  <Text
                    typography="t6"
                    className={cn(
                      "shrink-0 flex h-5 w-5 items-center justify-center rounded-full",
                      "bg-primary/12 dark:bg-primary-light/20",
                      "text-primary dark:text-primary-light font-bold"
                    )}
                  >
                    3
                  </Text>
                  <Text
                    typography="t6"
                    className="relative text-text-on-surface-muted dark:text-grey"
                  >
                    원하는 위치에 철봉이 없다면 주변 검색을 이용해보세요
                  </Text>
                </div>
              </div>
            </Section>
          )}
        </>
      )}
    </SideMain>
  );
};

export default SearchClient;
