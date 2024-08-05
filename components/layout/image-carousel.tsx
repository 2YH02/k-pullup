"use client";

import type { newPicturesRes } from "@api/marker/new-pictures";
import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ImageCarouselProps {
  data: newPicturesRes[];
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  withRoute?: boolean;
  onClick?: VoidFunction;
}

const ImageCarousel = ({
  data,
  size = "lg",
  priority = false,
  withRoute = false,
  onClick,
}: ImageCarouselProps) => {
  const router = useRouter();
  const carouselSize =
    size === "sm" ? "w-12 h-12" : size === "md" ? "w-24 h-24" : "w-32 h-32";

  return (
    <Carousel opts={{ dragFree: true }}>
      <CarouselContent className={`-ml-1 gap-3 ${carouselSize} p-1`}>
        {data.map((item) => (
          <CarouselItem key={item.markerId} className="p-0">
            <button
              className="w-full h-full overflow-hidden rounded-lg shadow-md"
              onClick={
                onClick
                  ? onClick
                  : withRoute
                  ? () => {
                      router.push(`/pullup/${item.markerId}`);
                    }
                  : undefined
              }
            >
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
