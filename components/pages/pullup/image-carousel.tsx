"use client";

import Skeleton from "@/components/common/skeleton";
import type { Photo } from "@/types/marker.types";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageCarouselProps {
  photos?: Photo[];
}

const ImageCarousel = ({ photos }: ImageCarouselProps) => {
  const [loading, setLoading] = useState(false);

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  if (!photos) return null;

  return (
    <Carousel plugins={[plugin.current]} className="rounded-md overflow-hidden">
      <CarouselContent>
        {photos.map((photo) => (
          <CarouselItem key={photo.photoId}>
            <div className="h-44 w-full rounded-md overflow-hidden">
              {!loading && <Skeleton className="h-full w-full rounded-md" />}
              <Image
                src={photo.photoUrl}
                alt="상세"
                width={0}
                height={0}
                sizes="100vw"
                className={`w-full h-full object-cover ${
                  !loading ? "invisible" : "visible"
                }`}
                onLoad={() => setLoading(true)}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ImageCarousel;
