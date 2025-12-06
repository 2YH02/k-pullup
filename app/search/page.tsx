import getDeviceType from "@lib/get-device-type";
import { headers } from "next/headers";
import { type Device } from "../mypage/page";
import SearchClient from "./search-client";
import SearchResult from "./search-result";

interface PageProps {
  searchParams: {
    addr: string;
    d?: string;
    lat?: string;
    lng?: string;
  };
}

export const generateMetadata = () => {
  return {
    title: "검색 - 대한민국 철봉 지도",
    description: "원하는 위치를 검색하고, 주변에 철봉이 있는지 확인해보세요!",
  };
};

const SearchPage = ({ searchParams }: PageProps) => {
  const { addr, d, lat, lng } = searchParams;

  const headersList = headers();
  const referrer = headersList.get("referer");
  const userAgent = headersList.get("user-agent");

  const deviceType: Device = getDeviceType(userAgent as string);

  if (addr || d) {
    if (d) {
      return (
        <SearchResult address={addr} markerId={d} deviceType={deviceType} />
      );
    } else {
      if (!lat || !lng) {
        return <SearchResult address={addr} deviceType={deviceType} />;
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
      <SearchClient isInternal={referrer?.includes(headersList.get("host") || "")} deviceType={deviceType} />
    </>
  );
};

export default SearchPage;
