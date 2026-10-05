"use client";

import cn from "@lib/cn";
import Image from "next/image";
import { useState } from "react";
import Skeleton from "./skeleton";
import LoadingIcon from "../icons/loading-icon";

const ImageWrap = ({
  src,
  h,
  w,
  alt,
  loading = "skeleton",
  className,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
  loading?: "skeleton" | "icon";
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <>
          {loading === "skeleton" ? (
            <Skeleton className="w-full h-full mx-auto rounded-md" />
          ) : (
            <LoadingIcon className="text-white flex absolute top-1/2 left-1/2" />
          )}
        </>
      )}
      <Image
        src={src}
        width={w}
        height={h}
        alt={alt}
        className={cn(
          `mx-auto ${isLoaded ? "visible" : "invisible"}`,
          className
        )}
        onLoad={() => setIsLoaded(true)}
        unoptimized
      />
    </>
  );
};

export default ImageWrap;
