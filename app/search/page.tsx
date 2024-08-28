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
      <SearchClient referrer={!!referrer} deviceType={deviceType}/>
    </>
  );
};

export default SearchPage;
