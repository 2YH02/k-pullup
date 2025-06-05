"use client";

import { decodeBlurhash, pixelsToDataUrl } from "@/lib/decode-hash";
import type { newPicturesRes } from "@api/marker/new-pictures";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HorizontalScroll, { ScrollItem } from "../common/horizontal-scroll";

interface ImageCarouselProps {
  data: newPicturesRes[];
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

  const [validData, setValidData] = useState<newPicturesRes[]>([]);

  useEffect(() => {
    const validateImages = async () => {
      const validatedData = await Promise.all(
        data.map(
          (item) =>
            new Promise<newPicturesRes | null>((resolve) => {
              const img = new window.Image();
              img.src = item.photoURL;
              img.onload = () => resolve(item);
              img.onerror = () => resolve(null);
            })
        )
      );

      setValidData(validatedData.filter(Boolean) as newPicturesRes[]);
    };

    validateImages();
  }, [data]);

  return (
    <HorizontalScroll>
      {validData.map((item) => (
        <ScrollItem key={item.markerId + item.photoURL} className="h-32 w-32">
          <button
            className="w-full h-full overflow-hidden rounded-lg"
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
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${item.photoURL}`}
              alt={`${item.markerId} 상세`}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
              priority={priority}
              draggable={false}
              placeholder="blur"
              blurDataURL={
                item.blurhash
                  ? pixelsToDataUrl(
                      decodeBlurhash(item.blurhash, 100, 200),
                      100,
                      200
                    )
                  : "/placeholder_image.png"
              }
            />
          </button>
        </ScrollItem>
      ))}
    </HorizontalScroll>
  );
};

export default ImageCarousel;
