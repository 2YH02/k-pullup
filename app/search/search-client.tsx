"use client";

import search from "@api/search/search";
import Section, { SectionTitle } from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import SearchHeader from "@pages/search/search-header";
import SearchList from "@pages/search/search-list";
import useSearchStore from "@store/useSearchStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type Device } from "../mypage/page";
import { Trash2 } from "lucide-react";

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

  const [result, setResult] = useState<SearchData[]>([]);

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
      // const locationSearch = await getSearchLoation(searchValue.value);
      const markerSearch = await search(searchValue.value);

      // const data = locationSearch.documents.map((item) => {
      //   return {
      //     address: item.address_name,
      //     position: { lat: item.y, lng: item.x },
      //   };
      // });

      if (markerSearch.error || markerSearch.message) {
        setResult([]);
        return;
      }

      setResult([...markerSearch.markers]);
    }, 300);

    return () => clearTimeout(handler);
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
        <SearchList result={result} />
      ) : (
        <>
          {searches.length > 0 && (
            <Section className="mt-3">
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
                        className="flex items-center p-3 text-left w-full h-full"
                        onClick={() => {
                          const url = !!search.d
                            ? `/pullup/${search.d}`
                            : `/search?addr=${search.addr}&lat=${search.lat}&lng=${search.lng}`;
                          router.push(url);
                        }}
                      >
                        <Text>{search.addr}</Text>
                      </button>
                      <button
                        className="ml-2"
                        onClick={() => removeItem(search.d as number)}
                      >
                        <Trash2 size={17} color="#333" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}
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
          </Section>
        </>
      )}
    </SideMain>
  );
};

export default SearchClient;
