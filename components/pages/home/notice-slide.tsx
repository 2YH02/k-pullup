"use client";

import { ALL_NOTICE } from "@/constant";
import Text from "@common/text";
import ArrowRightIcon from "@icons/arrow-right-icon";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsFillMegaphoneFill } from "react-icons/bs";

const NoticeSlide = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ALL_NOTICE.length);
        setIsFading(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      className="w-full flex items-center text-left px-2 py-2 border border-solid border-primary-light dark:border-grey rounded-md shadow"
      onClick={() => router.push("/notice")}
    >
      <div className="mr-2">
        <BsFillMegaphoneFill className="text-black-light dark:text-grey-light" />
      </div>
      <div className="grow flex items-center truncate">
        <Text
          fontWeight="bold"
          className={`truncate transition-opacity duration-300 ease-in-out ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
          typography="t6"
        >
          {ALL_NOTICE[currentIndex].title}
        </Text>
      </div>
      <div className="ml-2 shrink-0">
        <ArrowRightIcon color="black" size={15} />
      </div>
    </button>
  );
};

export default NoticeSlide;
