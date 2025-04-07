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
  const [loading, setLoading] = useState(false);

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);


  if (!photos) return null;

  return (
    <div className="rounded-md overflow-hidden embla" ref={emblaRef}>
      <div className="embla__container">
        {photos.map((photo) => (
          <div key={photo.photoId} className="h-44 w-full embla__slide mt-2 px-2">
            <div className="h-full w-full rounded-md overflow-hidden">
              {!loading && <Skeleton className="h-full w-full rounded-md" />}
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${photo.photoUrl}`}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
