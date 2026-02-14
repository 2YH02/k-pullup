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
        title="최근 추가된 이미지"
        subTitle={count ? `총 등록된 이미지 ${count}개` : ""}
      />
      <ImageGallery
        images={data.map((item) => ({
          url: item.photoURL,
          markerId: item.markerId,
        }))}
      />
    </Section>
  );
};

export default NewImageSection;
