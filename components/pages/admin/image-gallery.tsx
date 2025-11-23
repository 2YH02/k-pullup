"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

/**
 * Image gallery with thumbnail grid and lightbox viewer
 */
const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={className}>
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon className="h-4 w-4 text-blue" />
          <span className="text-sm font-medium text-gray-700">
            첨부 사진 ({images.length})
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue transition-colors cursor-pointer group"
            >
              <Image
                src={url}
                alt={`Report photo ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-200"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                  <ImageIcon className="h-4 w-4 text-gray-700" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-5xl w-full h-[90vh] p-0 bg-black/95 border-none">
          {selectedIndex !== null && (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                <span className="text-sm text-white font-medium">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>

              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center p-16">
                <Image
                  src={images[selectedIndex]}
                  alt={`Report photo ${selectedIndex + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>
              )}

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  {images.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`relative w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                        index === selectedIndex
                          ? "border-white scale-110"
                          : "border-white/30 hover:border-white/60"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
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
