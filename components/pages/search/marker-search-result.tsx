import { type Marker } from "@/types/marker.types";
import markerDetail from "@api/marker/marker-detail";
import Section from "@common/section";
import SideMain from "@common/side-main";
import Skeleton from "@common/skeleton";
import Text from "@common/text";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MarkerSearchResultProps {
  address: string;
  markerId: number;
}

const MarkerSearchResult = ({ address, markerId }: MarkerSearchResultProps) => {
  const router = useRouter();
  const [marker, setMarker] = useState<Marker | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await markerDetail({ id: markerId });

      if (marker?.error) {
        setError(true);
        setLoading(false);
        return;
      }

      setMarker(data);
      setError(false);
      setLoading(false);
    };

    fetch();
  }, []);

  if (loading) {
    return (
      <SideMain headerTitle={address} hasBackButton>
        <Skeleton className="h-[112px] m-4" />
      </SideMain>
    );
  }

  return (
    <SideMain headerTitle={address} hasBackButton>
      {error ? (
        <Text display="block" textAlign="center" className="text-red">
          잠시 후 다시 시도해주세요
        </Text>
      ) : (
        <>
          {marker && (
            <Section>
              <button
                className="pb-4 flex items-center border-b border-solid dark:border-grey-dark"
                onClick={() => router.push(`/pullup/${markerId}`)}
              >
                <div className="w-24 h-24 mr-4 shrink-0">
                  <Image
                    src={
                      marker.photos
                        ? marker.photos[0].photoUrl
                        : "/metaimg.webp"
                    }
                    alt={`${marker.markerId} 상세`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="w-[calc(100%-96px)]">
                  <Text className="break-all mb-4" display="block">
                    {marker.address}
                  </Text>
                  <Text
                    className="break-all text-grey dark:text-grey"
                    display="block"
                    typography="t6"
                  >
                    {marker.description || "작성된 설명이 없습니다."}
                  </Text>
                </div>
              </button>
            </Section>
          )}
        </>
      )}
    </SideMain>
  );
};

export default MarkerSearchResult;
