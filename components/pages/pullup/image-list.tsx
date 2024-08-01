"use client";

import type { Photo } from "@/types/marker.types";
import ImageWrap from "@common/Image-wrap";
import useImageModalStore from "@store/useImageModalStore";
import { useMemo } from "react";

type Props = {
  photos?: Photo[];
};

const ImageList = ({ photos }: Props) => {
  const { openModal } = useImageModalStore();

  const images = useMemo(() => {
    if (!photos) return null;
    return photos.map((photo) => photo.photoUrl);
  }, [photos]);

  return (
    <div className="flex">
      {photos && images ? (
        <>
          <div className="w-1/2 mr-1">
            {photos.map((photo, i) => {
              if (i % 2 === 1) return;
              return (
                <button
                  key={photo.photoId}
                  className="w-full"
                  onClick={() => {
                    openModal({ images, curIndex: i });
                  }}
                >
                  <ImageWrap
                    src={photo.photoUrl}
                    w={230}
                    h={230}
                    alt="상세"
                    className="rounded-md"
                  />
                </button>
              );
            })}
          </div>
          <div className="w-1/2 ml-1">
            {photos.map((photo, i) => {
              if (i % 2 !== 1) return;
              return (
                <button
                  key={photo.photoId}
                  className="w-full"
                  onClick={() => {
                    openModal({ images, curIndex: i });
                  }}
                >
                  <ImageWrap
                    src={photo.photoUrl}
                    w={230}
                    h={230}
                    alt="상세"
                    className="rounded-md"
                  />
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div>등록된 사진이 없습니다.</div>
      )}
    </div>
  );
};

export default ImageList;
