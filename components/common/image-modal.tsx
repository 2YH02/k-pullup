"use client";

import type { Device } from "@/types/device";
import cn from "@/lib/cn";
import CloseIcon from "@icons/close-icon";
import useImageModalStore from "@store/useImageModalStore";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import LoadingIcon from "../icons/loading-icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./carousel";
import Dimmed from "./dimmed";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [imageSize, setImageSize] = useState(DEFAULT_IMAGE_SIZE);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(curIndex);

  useEffect(() => {
    setLoadedUrls(new Set());
    setFailedUrls(new Set());
    setImageSize(DEFAULT_IMAGE_SIZE);
    setCurrentIndex(curIndex);
  }, [curIndex, imageUrl]);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on("select", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

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

  const handleClose = useCallback(() => {
    setLoadedUrls(new Set());
    setFailedUrls(new Set());
    setImageSize(DEFAULT_IMAGE_SIZE);
    closeModal();
  }, [closeModal]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [handleClose, open]);

  const isMobileApp =
    deviceType === "ios-mobile-app" || deviceType === "android-mobile-app";

  if (!open) return null;

  return (
    <Dimmed onClose={handleClose} onWheel={handleWheel}>
      <button
        type="button"
        aria-label="이미지 모달 닫기"
        ref={closeButtonRef}
        className={`absolute ${
          isMobileApp ? "top-14" : "top-3"
        } right-3 z-40 rounded-full bg-black/70 p-2 text-white transition-colors duration-150 active:bg-black/85 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/70`}
        onClick={handleClose}
      >
        <CloseIcon color="white" />
      </button>
      {imageUrl.length > 1 && (
        <div
          aria-live="polite"
          className="absolute left-3 top-3 z-40 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white"
        >
          {Math.min(currentIndex + 1, imageUrl.length)} / {imageUrl.length}
        </div>
      )}
      <Carousel
        opts={{ startIndex: Math.max(0, Math.min(curIndex, imageUrl.length - 1)) }}
        setApi={setCarouselApi}
        className="absolute left-1/2 top-1/2 max-h-[calc(100dvh-7rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 web:w-[80%]"
      >
        <CarouselContent>
          {imageUrl.map((image, index) => {
            const isLoaded = loadedUrls.has(image);
            const hasFailed = failedUrls.has(image);
            const isReady = isLoaded || hasFailed;
            return (
              <CarouselItem
                key={image}
                className="flex items-center justify-center"
              >
                {!isReady && (
                  <LoadingIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
                <Image
                  src={image}
                  alt={`철봉 이미지 ${index + 1}`}
                  width={imageSize}
                  height={imageSize}
                  className={cn(
                    "mx-auto max-h-[calc(100dvh-7rem)] max-w-[calc(100vw-2rem)] object-contain transition-opacity duration-500 ease-in-out",
                    isReady ? "opacity-100" : "opacity-0"
                  )}
                  onLoadingComplete={() =>
                    setLoadedUrls((prev) => {
                      const next = new Set(prev);
                      next.add(image);
                      return next;
                    })
                  }
                  onError={() =>
                    setFailedUrls((prev) => {
                      const next = new Set(prev);
                      next.add(image);
                      return next;
                    })
                  }
                  unoptimized
                />
                {hasFailed && (
                  <span className="absolute inset-x-0 bottom-4 text-center text-xs text-white/80">
                    이미지를 불러오지 못했습니다.
                  </span>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {imageUrl.length > 1 && (
          <>
            <CarouselPrevious
              className="left-2 top-1/2 size-10 -translate-y-1/2 bg-black/65 p-0 text-white disabled:bg-black/35 disabled:text-white/50 web:-left-12 web:size-auto web:p-2 web:hover:bg-black/80"
            />
            <CarouselNext
              className="right-2 top-1/2 size-10 -translate-y-1/2 bg-black/65 p-0 text-white disabled:bg-black/35 disabled:text-white/50 web:-right-12 web:size-auto web:p-2 web:hover:bg-black/80"
            />
          </>
        )}
      </Carousel>
    </Dimmed>
  );
};

export default ImageModal;
