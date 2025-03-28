"use client";

import Text from "@common/text";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import { PullupProsIcon, PullupRankingIcon } from "./slide-icons";

interface List {
  title: string;
  icon?: React.ReactNode;
  color?: React.ComponentProps<"button">["className"];
  url: string;
}

const ArticleCarousel = () => {
  const router = useRouter();

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);

  const list: List[] = [
    {
      title: "철봉 가이드",
      icon: <PullupRankingIcon size={46} />,
      color: "bg-beige dark:bg-[#b4a694]",
      url: "/article/1",
    },
    {
      title: "철봉 장점 및 주의사항",
      icon: <PullupProsIcon size={46} />,
      color: "bg-coral dark:bg-[#cf968e]",
      url: "/article/2",
    },
  ];

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {list.map((item) => (
          <div key={item.title} className="embla__slide h-28 w-full px-1">
            <button
              className={`${item.color} rounded-lg h-full w-full flex items-center justify-center text-lg select-none`}
              onClick={() => router.push(item.url)}
            >
              {item.icon && <div className="mr-5">{item.icon}</div>}
              <Text className="dark:text-black">{item.title}</Text>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleCarousel;
