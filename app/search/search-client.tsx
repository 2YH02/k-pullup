"use client";

import Section from "@/components/common/section";
import SearchIcon from "@/components/icons/search-icon";
import search, { type SearchMarkers } from "@api/search/search";
import SideMain from "@common/side-main";
import Text from "@common/text";
import useInput from "@hooks/useInput";
import SearchHeader from "@pages/search/search-header";
import { useEffect, useState } from "react";

const SearchClient = () => {
  const searchValue = useInput("");

  const [result, setResult] = useState<SearchMarkers[]>([]);
  const [distance, setDistance] = useState(5000);

  useEffect(() => {
    if (searchValue.value === "") {
      setResult([]);
      return;
    }
    const handler = setTimeout(async () => {
      const data = await search(searchValue.value);

      setResult(data.markers);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue.value]);

  return (
    <SideMain fullHeight>
      <SearchHeader value={searchValue.value} onChange={searchValue.onChange} />
      {result.length === 0 && (
        <Section>
          <div>주변 {distance}검색</div>
          <div>
            <input
              type="range"
              id="opacityRange"
              className="w-full h-2 bg-primary-light appearance-none rounded-lg cursor-pointer"
              style={{
                background: `linear-gradient(to right, #f9b4ab 0%, #f9b4ab ${
                  (distance - 100) / 49
                }%, #facec8 ${(distance - 100) / 49}%, #facec8 100%)`,
              }}
              min="100"
              max="5000"
              step="100"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
            />
          </div>
        </Section>
      )}

      {result.length > 0 && (
        <ul>
          {result
            .filter((item) =>
              item.address
                .toLowerCase()
                .includes(searchValue.value.toLowerCase())
            )
            .map((item, index) => (
              <li
                key={`${item.markerId}-${index}`}
                className="border-b border-solid"
              >
                <button className="flex items-center p-3 text-left w-full h-full">
                  <div className="mr-3">
                    <SearchIcon
                      size={20}
                      className="fill-black dark:fill-white"
                    />
                  </div>
                  <div>{highlightText(item.address, searchValue.value)}</div>
                </button>
              </li>
            ))}
        </ul>
      )}
    </SideMain>
  );
};

const highlightText = (text: string, highlight: string): React.ReactNode => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <Text key={index} className="text-primary-dark">
        {part}
      </Text>
    ) : (
      part
    )
  );
};

export default SearchClient;
