"use client";

import type { Photo } from "@/types/marker.types";
import Skeleton from "@common/skeleton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useState } from "react";

interface ImageCarouselProps {
  photos?: Photo[];
}

const ImageCarousel = ({ photos }: ImageCarouselProps) => {
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);


  if (!photos) return null;

  return (
    <div className="rounded-md overflow-hidden embla" ref={emblaRef}>
      <div className="embla__container">
        {photos.map((photo, index) => {
          const isLoaded = loadedUrls.has(photo.photoUrl);
          return (
            <div key={photo.photoId} className="h-44 w-full embla__slide mt-2 px-2">
              <div className="h-full w-full rounded-md overflow-hidden">
                {!isLoaded && <Skeleton className="h-full w-full rounded-md" />}
                <Image
                  src={photo.photoUrl}
                  alt="상세"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className={`w-full h-full object-cover ${
                    !isLoaded ? "invisible" : "visible"
                  }`}
                  onLoad={() =>
                    setLoadedUrls((prev) => {
                      const next = new Set(prev);
                      next.add(photo.photoUrl);
                      return next;
                    })
                  }
                  priority={index === 0}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;
