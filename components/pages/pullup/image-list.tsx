"use client";

import type { Photo } from "@/types/marker.types";
import Skeleton from "@common/skeleton";
import Image from "next/image";
import { useState } from "react";

type Props = {
  photos?: Photo[];
};

const ImageList = ({ photos }: Props) => {
  return (
    <div className="flex">
      {photos ? (
        <>
          <div className="w-1/2 mr-1">
            {photos.map((photo, i) => {
              if (i % 2 === 1) return;
              return (
                <button
                  key={photo.photoId}
                  className="w-full"
                  onClick={() => {}}
                >
                  <ImageWrap src={photo.photoUrl} w={230} h={230} alt="상세" />
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
                  onClick={() => {}}
                >
                  <ImageWrap src={photo.photoUrl} w={230} h={230} alt="상세" />
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

const ImageWrap = ({
  src,
  h,
  w,
  alt,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && <Skeleton className="w-full h-[140px] mx-auto rounded-md" />}
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        className={`mx-auto ${isLoaded ? "visible" : "invisible"} rounded-md`}
        onLoadingComplete={() => setIsLoaded(true)}
        unoptimized
      />
    </>
  );
};

export default ImageList;
