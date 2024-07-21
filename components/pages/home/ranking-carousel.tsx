"use client";

import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";

const RankingCarousel = () => {
  const list = [
    { color: "bg-beige" },
    { color: "bg-coral" },
    { color: "bg-[#6DC5D1]" },
    { color: "bg-[#DD761C]" },
    { color: "bg-[#D4BDAC]" },
  ];

  return (
    <Carousel
      opts={{ dragFree: true }}
      className="px-1"
    >
      <CarouselContent className="-ml-1 gap-3 w-28 h-28">
        {list.map((item, index) => (
          <CarouselItem
            key={item.color}
            className="pl-1"
          >
            <div className={`p-1 ${item.color} rounded-lg w-full h-full select-none`}>
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default RankingCarousel;
