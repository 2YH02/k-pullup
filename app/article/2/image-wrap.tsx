"use client";

import Skeleton from "@common/skeleton";
import cn from "@lib/cn";
import Image from "next/image";
import { useState } from "react";

const ImageWrap = ({
  src,
  h,
  w,
  alt,
  className,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full mx-auto rounded-md" />
      )}
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        className={cn(
          `mx-auto transition-opacity duration-500 ease-in-out`,
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        unoptimized
      />
    </div>
  );
};

export default ImageWrap;
