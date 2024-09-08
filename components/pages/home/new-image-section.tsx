"use client";

import { type newPicturesRes } from "@api/marker/new-pictures";
import Section, { SectionTitle } from "@common/section";
import ImageCarousel from "@layout/image-carousel";
import useImageCountStore from "@store/useImageCountStore";

const NewImageSection = ({ data }: { data: newPicturesRes[] }) => {
  const { count } = useImageCountStore();

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
