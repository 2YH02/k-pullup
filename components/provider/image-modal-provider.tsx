"use client";

import ImageModal from "@common/image-modal";
import useImageModalStore from "@store/useImageModalStore";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ImageModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { images, open, curIndex } = useImageModalStore();
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalEl(document.getElementById("image-portal"));
  }, []);

  return (
    <>
      {children}
      {portalEl &&
        createPortal(
          <ImageModal imageUrl={images} open={open} curIndex={curIndex} />,
          portalEl
        )}
    </>
  );
};

export default ImageModalProvider;
