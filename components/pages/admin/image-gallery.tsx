"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import cn from "@lib/cn";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

export interface GalleryImageItem {
  url: string;
  markerId?: number;
}

type ImageGalleryItem = string | GalleryImageItem;

interface ImageGalleryProps {
  images: ImageGalleryItem[];
  className?: string;
}

/**
 * Image gallery with thumbnail grid and lightbox viewer
 */
const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 40;
  const normalizedImages = useMemo<GalleryImageItem[]>(
    () =>
      images.map((item) =>
        typeof item === "string"
          ? { url: item }
          : { url: item.url, markerId: item.markerId }
      ),
    [images]
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return prev;
      return (prev - 1 + normalizedImages.length) % normalizedImages.length;
    });
  }, [normalizedImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return prev;
      return (prev + 1) % normalizedImages.length;
    });
  }, [normalizedImages.length]);

  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current;
    const endX = event.changedTouches[0]?.clientX;
    touchStartXRef.current = null;

    if (startX === null || endX === undefined) return;

    const deltaX = endX - startX;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      handleNext();
      return;
    }

    handlePrevious();
  }, [handleNext, handlePrevious]);

  if (!normalizedImages || normalizedImages.length === 0) {
    return null;
  }

  const selectedImage = selectedIndex !== null ? normalizedImages[selectedIndex] : null;
  const selectedMarkerId = selectedImage?.markerId;

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={className}>
        <div className="columns-2 gap-3 [column-fill:balance]">
          {normalizedImages.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              onClick={() => handleSelect(index)}
              type="button"
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-primary/12 bg-side-main shadow-[0_1px_6px_rgba(64,64,56,0.08)] transition-all duration-300 web:hover:-translate-y-0.5 web:hover:shadow-[0_10px_18px_rgba(64,64,56,0.16)] active:scale-[0.99] active:border-primary/35 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-surface dark:border-grey-dark dark:bg-black/35 dark:web:hover:border-primary-light/35"
            >
              <Image
                src={item.url}
                alt={`Report photo ${index + 1}`}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 50vw, 50vw"
                className="h-auto w-full object-cover transition-transform duration-300 web:group-hover:scale-[1.03] group-active:scale-[1.02]"
                unoptimized
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 web:group-hover:bg-black/12 group-active:bg-black/10">
                <div className="opacity-0 transition-opacity duration-300 web:group-hover:opacity-100 group-active:opacity-100 rounded-full bg-white/85 p-2">
                  <ImageIcon className="h-4 w-4 text-text-on-surface" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent
          showCloseButton={false}
          className="h-[min(92dvh,860px)] w-[min(100vw-1rem,1040px)] overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-0 shadow-[0_24px_60px_rgba(0,0,0,0.45)] mo:left-0 mo:top-0 mo:h-dvh mo:w-dvw mo:max-w-none mo:translate-x-0 mo:translate-y-0 mo:rounded-none mo:border-none"
        >
          <DialogTitle className="sr-only">이미지 갤러리</DialogTitle>
          {selectedIndex !== null && (
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-24 bg-linear-to-b from-black/55 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-36 bg-linear-to-t from-black/60 to-transparent" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                type="button"
                className="absolute right-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white transition-colors hover:bg-black/55 mo:h-11 mo:w-11"
                aria-label="닫기"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Image Counter */}
              <div className="absolute left-3 top-3 z-50 rounded-full border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur-xs">
                <span className="text-xs font-semibold tracking-wide text-white/95">
                  {selectedIndex + 1} / {normalizedImages.length}
                </span>
              </div>

              {/* Previous Button */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={handlePrevious}
                  type="button"
                  className="absolute left-3 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 transition-colors hover:bg-black/55 web:flex"
                  aria-label="이전 이미지"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
              )}

              {/* Main Image */}
              <div
                className="relative flex h-full w-full items-center justify-center p-3 sm:p-10"
                onTouchStart={
                  normalizedImages.length > 1 ? handleTouchStart : undefined
                }
                onTouchEnd={
                  normalizedImages.length > 1 ? handleTouchEnd : undefined
                }
              >
                <Image
                  src={selectedImage?.url || ""}
                  alt={`Report photo ${selectedIndex + 1}`}
                  fill
                  sizes="100vw"
                  priority
                  className="object-contain"
                  unoptimized
                />
              </div>

              {selectedMarkerId !== undefined && (
                <Link
                  href={`/pullup/${selectedMarkerId}`}
                  onClick={handleClose}
                  className="absolute bottom-24 right-3 z-50 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-xs font-semibold text-white transition-colors web:hover:bg-black/60 active:bg-black/65"
                >
                  상세 보기
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}

              {/* Next Button */}
              {normalizedImages.length > 1 && (
                <button
                  onClick={handleNext}
                  type="button"
                  className="absolute right-3 z-50 hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 transition-colors hover:bg-black/55 web:flex"
                  aria-label="다음 이미지"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              )}

              {/* Thumbnail Strip */}
              {normalizedImages.length > 1 && (
                <div className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3 pt-2">
                  <div className="mx-auto flex h-20 w-full gap-2 overflow-x-auto rounded-xl border border-white/10 bg-black/35 p-2 backdrop-blur-xs scrollbar-hidden">
                    {normalizedImages.map((item, index) => (
                      <button
                        key={`${item.url}-thumb-${index}`}
                        onClick={() => handleSelect(index)}
                        type="button"
                        className={cn(
                          "relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                          index === selectedIndex
                            ? "scale-105 border-white"
                            : "border-white/25 web:hover:border-white/55 active:border-white/70"
                        )}
                      >
                        <Image
                          src={item.url}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
