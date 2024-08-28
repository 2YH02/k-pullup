"use client";

import Section from "@common/section";
import SideMain from "@common/side-main";
import Text from "@common/text";
import AroundSearch from "@pages/search/around-search";
import MarkerSearchResult from "@pages/search/marker-search-result";
import { useRouter } from "next/navigation";
import { type Device } from "../mypage/page";

interface SearchResultProps {
  address: string;
  markerId?: string;
  lat?: string;
  lng?: string;
  deviceType?: Device;
}

const SearchResult = ({
  address,
  lat,
  lng,
  markerId,
  deviceType = "desktop",
}: SearchResultProps) => {
  const router = useRouter();

  if (markerId) {
    return <MarkerSearchResult address={address} markerId={Number(markerId)} />;
  }

  if (!lat || !lng) {
    return (
      <SideMain
        headerTitle={address}
        hasBackButton
        fullHeight
        deviceType={deviceType}
      >
        <Text
          className="text-red dark:text-red mt-4"
          display="block"
          textAlign="center"
        >
          잘못된 접근입니다. 다시 시도해주세요!
        </Text>
      </SideMain>
    );
  }

  return (
    <SideMain
      headerTitle={address}
      hasBackButton
      fullHeight
      prevClick={() => router.push("/search")}
      deviceType={deviceType}
    >
      <Section>
        <Text typography="t6" display="block" textAlign="center">
          해당 위치에 철봉이 없습니다.
        </Text>
        <Text typography="t6" display="block" textAlign="center">
          주변에서 위치를 탐색해보세요!
        </Text>
      </Section>
      <AroundSearch address={address} lat={lat} lng={lng} />
    </SideMain>
  );
};

export default SearchResult;
