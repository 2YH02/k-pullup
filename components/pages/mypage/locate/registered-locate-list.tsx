"use client";

import type {
  RegisteredMarker,
  RegisteredMarkerRes,
} from "@api/user/my-registered-location";
import myRegisteredLocation from "@api/user/my-registered-location";
import ListItem, { ListContents } from "@common/list-item";
import Skeleton from "@common/skeleton";
import useMapControl from "@hooks/useMapControl";
import PinIcon from "@icons/pin-icon";
import { useCallback, useEffect, useRef, useState } from "react";

interface RegisteredListProps {
  data: RegisteredMarkerRes;
}

const RegisteredLocateList = ({ data }: RegisteredListProps) => {
  const { move } = useMapControl();

  const [markers, setMarkers] = useState<RegisteredMarker[]>(data.markers);
  const [currentPage, setCurrentPage] = useState(data.currentPage);

  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadMoreMarkers = useCallback(async () => {
    if (isLoading || currentPage >= data.totalPages) return;

    setIsLoading(true);
    const newData = await myRegisteredLocation({
      pageParam: currentPage + 1,
    });

    setMarkers((prevMarkers) => [...prevMarkers, ...newData.markers]);
    setCurrentPage(newData.currentPage);
    
    setIsLoading(false);
  }, [currentPage, isLoading]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreMarkers();
        }
      },
      {
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreMarkers]);

  return (
    <>
      <ul>
        {markers.map((marker) => {
          return (
            <ListItem
              key={marker.markerId}
              icon={<PinIcon size={25} />}
              onClick={() =>
                move({ lat: marker.latitude, lng: marker.longitude })
              }
            >
              <ListContents
                title={marker.address}
                subTitle={marker.description}
              />
            </ListItem>
          );
        })}
      </ul>
      {isLoading && <Skeleton className="w-full h-16 rounded-lg" />}
      {data.totalPages > currentPage && (
        <div ref={loadMoreRef} className="w-full h-20" />
      )}
    </>
  );
};

export default RegisteredLocateList;
