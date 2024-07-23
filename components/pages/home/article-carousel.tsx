"use client";

import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
// TODO: 턱걸이 아티클 찾아서 링크 연결하기
// TODO: 첫 번째 슬라이드 - 철봉 가이드 article 페이지에 유튜브 영상 포함해서 추가

const ArticleCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const list = [
    { title: "철봉의 이점", color: "bg-beige" },
    { title: "철봉 장비 소개", color: "bg-coral" },
    { title: "철봉 안전 수칙 및 주의사항", color: "bg-[#6DC5D1]" },
  ];

  return (
    <Carousel plugins={[plugin.current]} className="px-1">
      <CarouselContent>
        {list.map((item) => (
          <CarouselItem key={item.title}>
            <button
              className={`h-28 w-full ${item.color} rounded-lg flex items-center justify-center text-lg select-none`}
              onClick={() => console.log(1)}
            >
              {item.title}
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ArticleCarousel;
