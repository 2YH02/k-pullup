import { Carousel, CarouselContent, CarouselItem } from "@common/carousel";
// TODO: 아이템 넓이 반응형 추가하기

const RankingCarousel = () => {
  const list = [
    { color: "bg-beige" },
    { color: "bg-coral" },
    { color: "bg-[#6DC5D1]" },
    { color: "bg-[#DD761C]" },
    { color: "bg-[#D4BDAC]" },
  ];
  return (
    <Carousel className="px-1">
      <CarouselContent className="-ml-1">
        {list.map((item, index) => (
          <CarouselItem key={item.color} className="pl-1 basis-1/3">
            <div
              className={`p-1 ${item.color} rounded-lg w-24 h-24 select-none`}
            >
              {index + 1}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default RankingCarousel;
