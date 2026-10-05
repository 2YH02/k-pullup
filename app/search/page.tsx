import { headers } from "next/headers";
import SearchClient from "./search-client";
import SearchResult from "./search-result";
import getServerDeviceType from "@lib/get-server-device-type";

interface PageProps {
  searchParams: {
    addr: string;
    d?: string;
    lat?: string;
    lng?: string;
    from?: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "검색 - 대한민국 철봉 지도",
    description: "원하는 위치를 검색하고, 주변에 철봉이 있는지 확인해보세요!",
  };
};

const SearchPage = ({ searchParams }: PageProps) => {
  const { addr, d, lat, lng, from } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");

  const deviceType = getServerDeviceType();

  if (addr || d) {
    if (d) {
      return (
        <SearchResult address={addr} markerId={d} deviceType={deviceType} />
      );
    } else {
      if (!lat || !lng) {
        return (
          <SearchClient
            isInternal={referrer?.includes(headersList.get("host") || "")}
            deviceType={deviceType}
            initialValue={addr}
          />
        );
      } else {
        return (
          <SearchResult
            address={addr}
            lat={lat}
            lng={lng}
            deviceType={deviceType}
          />
        );
      }
    }
  }

  return (
    <>
      <SearchClient
        isInternal={referrer?.includes(headersList.get("host") || "")}
        deviceType={deviceType}
        isEntryFromHome={from === "home"}
      />
    </>
  );
};

export default SearchPage;
