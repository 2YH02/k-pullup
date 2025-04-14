"use client";

import { type Device } from "@/app/mypage/page";
import cn from "@/lib/cn";
import CloseIcon from "@icons/close-icon";
import useImageModalStore from "@store/useImageModalStore";
import Image from "next/image";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import Dimmed from "./dimmed";
import Skeleton from "./skeleton";
// TODO: 사진 업로드 날짜 표시

const DEFAULT_IMAGE_SIZE = 400;

interface Props {
  open?: boolean;
  imageUrl: string[];
  curIndex: number;
  deviceType?: Device;
}

const ImageModal = ({
  open,
  curIndex,
  imageUrl,
  deviceType = "desktop",
}: Props) => {
  const { closeModal } = useImageModalStore();

  const [imageSize, setImageSize] = useState(DEFAULT_IMAGE_SIZE);
  const [isLoaded, setIsLoaded] = useState(false);

  const zoomIn = () => {
    if (
      imageSize < 1000 &&
      window.innerWidth - 40 > imageSize &&
      window.innerHeight - 40 > imageSize
    ) {
      setImageSize((prev) => prev + 50);
    }
  };

  const zoomOut = () => {
    if (imageSize > 100) setImageSize((prev) => prev - 50);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  const handleClose = () => {
    setImageSize(DEFAULT_IMAGE_SIZE);
    closeModal();
  };

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  if (!open) return null;

  return (
    <Dimmed onClose={handleClose} onWheel={handleWheel}>
      <button
        className={`absolute ${
          isMobileApp ? "top-14" : "top-3"
        } right-3 z-40 bg-[rgba(0,0,0,0.7)] rounded-full p-2 `}
        onClick={handleClose}
      >
        <CloseIcon color="white" />
      </button>
      <Carousel
        opts={{ startIndex: curIndex }}
        className="web:w-[80%] mo:w-dvw absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <CarouselContent>
          {imageUrl.map((image) => (
            <CarouselItem
              key={image}
              className="flex items-center justify-center"
            >
              {!isLoaded && (
                <Skeleton className="absolute inset-0 w-full h-full mx-auto rounded-md" />
              )}
              <Image
                key={image}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${image}`}
                alt="상세"
                width={imageSize}
                height={imageSize}
                className={cn(
                  `mx-auto transition-opacity duration-500 ease-in-out`,
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoadingComplete={() => setIsLoaded(true)}
                unoptimized
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {imageUrl.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </Dimmed>
  );
};

export default ImageModal;
