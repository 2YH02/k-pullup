"use client";

import { type NewPictures } from "@api/marker/new-pictures";
import Section, { SectionTitle } from "@common/section";
import useImageCountStore from "@store/useImageCountStore";
import ImageGallery from "../admin/image-gallery";

const NewImageSection = ({ data }: { data: NewPictures[] }) => {
  const { count } = useImageCountStore();

  if (data.length === 0) return null;

  return (
    <Section>
      <SectionTitle
        title="새로 등록된 사진"
        subTitle={count ? `전체 ${count}장` : ""}
      />
      <ImageGallery
        imageAltPrefix="새로 등록된 사진"
        images={data.map((item) => ({
          url: item.photoURL,
          markerId: item.markerId,
        }))}
      />
    </Section>
  );
};

export default NewImageSection;
