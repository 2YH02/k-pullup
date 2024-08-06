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

  if (addr || d) {
    if (d) {
      return <SearchResult address={addr} markerId={d} />;
    } else {
      if (!lat || !lng) {
        return <SearchResult address={addr} />;
      } else {
        return <SearchResult address={addr} lat={lat} lng={lng} />;
      }
    }
  }

  return (
    <>
      <SearchClient />
    </>
  );
};

export default SearchPage;
