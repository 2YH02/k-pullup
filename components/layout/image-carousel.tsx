"use client";

import type { newPicturesRes } from "@api/marker/new-pictures";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Image from "next/image";

interface ImageCarouselProps {
  data: newPicturesRes[];
  priority?: boolean;
}

const ImageCarousel = ({ data, priority = false }: ImageCarouselProps) => {
  return (
    <Carousel opts={{ dragFree: true }}>
      <CarouselContent className="-ml-1 gap-3 w-32 h-32 p-1">
        {data.map((item) => (
          <CarouselItem key={item.markerId} className="p-0">
            <button className="w-full h-full overflow-hidden rounded-lg shadow-md">
              <Image
                src={item.photoURL}
                alt={`${item.markerId} 상세`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-full object-cover"
                priority={priority}
              />
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ImageCarousel;
