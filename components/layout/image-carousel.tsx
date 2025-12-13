"use client";

import type { NewPictures } from "@api/marker/new-pictures";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import HorizontalScroll, { ScrollItem } from "../common/horizontal-scroll";

interface ImageCarouselProps {
  data: NewPictures[];
  priority?: boolean;
  withRoute?: boolean;
  onClick?: VoidFunction;
}

const ImageCarousel = ({
  data,
  priority = false,
  withRoute = false,
  onClick,
}: ImageCarouselProps) => {
  const router = useRouter();

  // Memoize onClick handler to avoid recreating on every render
  const handleImageClick = useCallback(
    (markerId: number) => {
      if (onClick) {
        onClick();
      } else if (withRoute) {
        router.push(`/pullup/${markerId}`);
      }
    },
    [onClick, withRoute, router]
  );

  // Memoize blurhash decoding (CPU-intensive operation, client-side only)
  const itemsWithBlur = useMemo(
    () =>
      data.map((item) => {
        // Always use placeholder for SSR to avoid hydration mismatch
        const blurDataURL = "/placeholder_image.png";

        return {
          ...item,
          blurDataURL,
        };
      }),
    [data]
  );

  return (
    <HorizontalScroll>
      {itemsWithBlur.map((item) => (
        <ScrollItem key={item.markerId + item.photoURL} className="h-32 w-32">
          <button
            className="w-full h-full overflow-hidden rounded-lg"
            onClick={
              onClick || withRoute
                ? () => handleImageClick(item.markerId)
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
              draggable={false}
              placeholder="blur"
              blurDataURL={item.blurDataURL}
            />
          </button>
        </ScrollItem>
      ))}
    </HorizontalScroll>
  );
};

export default ImageCarousel;
