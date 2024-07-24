"use client";

import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
import Text from "@common/text";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { PullupIcon, PullupProsIcon, PullupRankingIcon } from "./slide-icons";
// TODO: 턱걸이 아티클 찾아서 링크 연결하기
// TODO: 슬라이드 스타일 변경

interface List {
  title: string;
  icon?: React.ReactNode;
  color?: React.ComponentProps<"button">["className"];
  url: string;
}

const ArticleCarousel = () => {
  const router = useRouter();

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const list: List[] = [
    {
      title: "철봉 가이드",
      icon: <PullupIcon />,
      color: "bg-beige dark:bg-[#b4a694]",
      url: "/article/1",
    },
    {
      title: "철봉 장점 및 주의사항",
      icon: <PullupProsIcon />,
      color: "bg-coral dark:bg-[#cf968e]",
      url: "/article/2",
    },
    {
      title: "핫한 지역",
      icon: <PullupRankingIcon />,
      color: "bg-[#6DC5D1] dark:bg-[#59a2ac]",
      url: "/ranking",
    },
  ];

  return (
    <Carousel plugins={[plugin.current]}>
      <CarouselContent>
        {list.map((item) => (
          <CarouselItem key={item.title}>
            <button
              className={`h-28 w-full ${item.color} rounded-lg flex items-center justify-center text-lg select-none`}
              onClick={() => router.push(item.url)}
            >
              {item.icon && <div className="mr-5">{item.icon}</div>}
              <Text className="dark:text-black">{item.title}</Text>
            </button>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default ArticleCarousel;
