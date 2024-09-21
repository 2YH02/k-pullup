"use client";

import cn from "@lib/cn";
import Text from "./text";
import { useEffect, useState } from "react";

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  as?: "button" | "div";
  position?: "left" | "right";
  className?: React.ComponentProps<"div">["className"];
  onClick?: VoidFunction;
}

// TODO: 툴팁 onclick 추가

const Tooltip = ({
  title,
  className,
  as = "div",
  position = "right",
  children,
  onClick,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 484);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getTooltipPosition = () => {
    switch (position) {
      case "left":
        return "right-full mr-2";
      case "right":
      default:
        return "left-full ml-2";
    }
  };

  const Container = as === "button" ? "button" : "div";

  return (
    <Container
      onMouseEnter={!isMobile ? () => setIsVisible(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsVisible(false) : undefined}
      onMouseDown={isMobile ? () => setIsVisible(true) : undefined}
      onMouseUp={isMobile ? () => setIsVisible(false) : undefined}
      onMouseOut={isMobile ? () => setIsVisible(false) : undefined}
      className={cn("", className)}
      onClick={onClick ? onClick : undefined}
    >
      {isVisible && (
        <span
          className={`absolute ${getTooltipPosition()} top-1/2 transform -translate-y-1/2 rounded-lg p-2 shadow-lg whitespace-nowrap bg-white dark:bg-black-light`}
        >
          <Text>{title}</Text>
        </span>
      )}
      <div className="">{children}</div>
    </Container>
  );
};

export default Tooltip;
