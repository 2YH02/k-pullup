"use client";

import useImageModalStore from "@store/useImageModalStore";
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import Dimmed from "./dimmed";
import ImageWrap from "./Image-wrap";

interface Props {
  open?: boolean;
  imageUrl: string[];
  curIndex: number;
}

const ImageModal = ({ open, curIndex, imageUrl }: Props) => {
  const { closeModal } = useImageModalStore();

  const [imageSize, setImageSize] = useState(400);

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
    console.log(1);
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  if (!open) return null;

  return (
    <Dimmed onClose={() => closeModal()} onWheel={handleWheel}>
      <button className="absolute top-3 right-3" onClick={() => closeModal()}>
        <CloseIcon />
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
              <ImageWrap
                key={image}
                src={image}
                alt="상세"
                w={imageSize}
                h={imageSize}
                loading="icon"
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

const CloseIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      width={30}
      height={30}
    >
      <path
        d="m14.8 12 3.6-3.6c.8-.8.8-2 0-2.8-.8-.8-2-.8-2.8 0L12 9.2 8.4 5.6c-.8-.8-2-.8-2.8 0-.8.8-.8 2 0 2.8L9.2 12l-3.6 3.6c-.8.8-.8 2 0 2.8.4.4.9.6 1.4.6s1-.2 1.4-.6l3.6-3.6 3.6 3.6c.4.4.9.6 1.4.6s1-.2 1.4-.6c.8-.8.8-2 0-2.8L14.8 12z"
        className="fill-grey-light"
      ></path>
    </svg>
  );
};
export default ImageModal;
