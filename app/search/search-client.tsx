"use client";

import getSearchLoation from "@api/common/get-search-location";
import search from "@api/search/search";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import SearchHeader from "@pages/search/search-header";
import SearchList from "@pages/search/search-list";
import { useEffect, useState } from "react";

export interface SearchData {
  address: string;
  markerId?: number;
  position?: { lat: string; lng: string };
}

const SearchClient = () => {
  const searchValue = useInput("");
  const [result, setResult] = useState<SearchData[]>([]);

  useEffect(() => {
    if (searchValue.value === "") {
      setResult([]);
      return;
    }
    const handler = setTimeout(async () => {
      const locationSearch = await getSearchLoation(searchValue.value);
      const markerSearch = await search(searchValue.value);

      const data = locationSearch.documents.map((item) => {
        return {
          address: item.address_name,
          position: { lat: item.y, lng: item.x },
        };
      });

      if (markerSearch.error || markerSearch.message) {
        setResult([]);
        return;
      }

      setResult([...markerSearch.markers, ...data]);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue.value]);

  return (
    <SideMain fullHeight>
      <SearchHeader value={searchValue.value} onChange={searchValue.onChange} />

      {result && result.length > 0 && searchValue.value.length > 0 ? (
        <SearchList result={result} value={searchValue.value} />
      ) : (
        <Section className="mt-3">
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
      )}
    </SideMain>
  );
};

export default SearchClient;
