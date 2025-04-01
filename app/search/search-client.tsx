"use client";

import search from "@api/search/search";
import Button from "@common/button";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import useMapControl from "@hooks/useMapControl";
import type { KakaoPagination, KakaoPlace } from "@layout/move-map-input";
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
  referrer,
  deviceType = "desktop",
}: {
  referrer?: boolean;
  deviceType?: Device;
}) => {
  const router = useRouter();

  const searchValue = useInput("");

  const { searches, clearSearches, removeItem } = useSearchStore();
  const { move } = useMapControl();

  const [result, setResult] = useState<SearchData[]>([]);
  const [kakaoSearchData, setKakaoSearchData] = useState<KakaoPlace[]>([]);

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
    if (searchValue.value === "") {
      setResult([]);
      return;
    }
    const handler = setTimeout(async () => {
      const markerSearch = await search(searchValue.value);

      if (markerSearch.error || markerSearch.message) {
        setResult([]);
        return;
      }

      setResult([...markerSearch.markers]);
    }, 300);

    // 카카오 주소 검색
    if (searchValue.value === "") {
      setResult([]);
      return;
    }

    let ps = new window.kakao.maps.services.Places();

    const placesSearchCB = (
      data: KakaoPlace[],
      status: string,
      _: KakaoPagination
    ) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setKakaoSearchData([...data]);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        return;
      } else if (status === window.kakao.maps.services.Status.ERROR) {
        return;
      }
    };

    const kakaoSearchHandler = setTimeout(async () => {
      ps.keywordSearch(searchValue.value, placesSearchCB);
    }, 300);

    return () => {
      clearTimeout(kakaoSearchHandler);
      clearTimeout(handler);
    };
  }, [searchValue.value]);

  return (
    <SideMain fullHeight className={isMobileApp ? "pt-12" : ""}>
      <SearchHeader
        value={searchValue.value}
        onChange={searchValue.onChange}
        referrer={!!referrer}
        clearFn={() => searchValue.resetValue()}
      />

      {result && searchValue.value.length > 0 ? (
        <SearchList result={result} kakaoSearchResult={kakaoSearchData} />
      ) : (
        <>
          <Section>
            <Text
              className="mb-2"
              typography="t5"
              display="block"
              fontWeight="bold"
            >
              원하는 주소에 철봉이 있는지 확인해 보세요.
            </Text>
            <Text typography="t6" display="block">
              철봉이 없을 경우, 주변 지역을 검색하여 철봉 위치를 확인할 수
              있습니다.
            </Text>
            <Button
              className="mt-2"
              size="sm"
              onClick={() => router.push("/search/around")}
            >
              주변 검색
            </Button>
          </Section>
          {searches.length > 0 && (
            <Section>
              <div className="flex justify-between items-center">
                <SectionTitle title="최근 검색" />
                <button onClick={() => clearSearches()}>
                  <Text typography="t6" className="text-grey dark:text-grey">
                    목록 전체 삭제
                  </Text>
                </button>
              </div>
              <ul>
                {searches.map((search, index) => {
                  return (
                    <li
                      key={`${search}-${index}`}
                      className="border-b border-solid dark:border-grey-dark flex"
                    >
                      <button
                        className="flex items-center py-3 text-left w-full h-full"
                        onClick={() => {
                          if (search.d) {
                            router.push(`/pullup/${search.d}`);
                          } else {
                            console.log(search);
                            move({
                              lat: Number(search.lat),
                              lng: Number(search.lng),
                            });
                          }
                        }}
                      >
                        <div className="flex flex-col">
                          <Text typography="t6" className="break-all">
                            {highlightText(
                              removeMarkTags(search.addr as string),
                              extractMarkedText(search.addr as string).marked
                            )}
                          </Text>
                          {search.place && (
                            <Text
                              typography="t7"
                              className="break-all text-grey dark:text-grey"
                            >
                              {search.place}
                            </Text>
                          )}
                        </div>
                      </button>
                      <button
                        className="ml-2"
                        onClick={() => removeItem(search.addr as string)}
                      >
                        <BsXLg color="#333" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}
        </>
      )}
    </SideMain>
  );
};

export default SearchClient;
