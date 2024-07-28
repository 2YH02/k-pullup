"use client";

import ArrowUpIcon from "@icons/arrow-up-icon";
import useScrollRefStore from "@store/useScrollRefStore";

const ScrollToTop = () => {
  const { containerRef } = useScrollRefStore();

  const scrollToTop = () => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full h-28 p-4 bg-grey-light dark:bg-black-light`}
    >
      <button
        className="flex items-center justify-center shadow-simple bg-white dark:bg-black
        border border-solid border-grey-light dark:border-black-light w-10 h-10 rounded-full"
        onClick={scrollToTop}
      >
        <ArrowUpIcon color="black" />
      </button>
    </div>
  );
};

export default ScrollToTop;
