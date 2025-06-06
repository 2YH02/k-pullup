"use client";

import { type NewPictures } from "@api/marker/new-pictures";
import Section, { SectionTitle } from "@common/section";
import ImageCarousel from "@layout/image-carousel";
import useImageCountStore from "@store/useImageCountStore";

const NewImageSection = ({ data }: { data: NewPictures[] }) => {
  const { count } = useImageCountStore();

  if (data.length === 0) return null;

  return (
    <Section>
      <SectionTitle
        title="최근 추가된 이미지"
        subTitle={count ? `총 등록된 이미지 ${count}개` : ""}
      />
      <ImageCarousel data={data} priority={true} withRoute />
    </Section>
  );
};

export default NewImageSection;
