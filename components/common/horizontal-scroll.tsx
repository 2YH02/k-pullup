import cn from "@lib/cn";
import { useRef, useState } from "react";

const DRAG_THRESHOLD = 2;

const HorizontalScroll = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const dragDistance = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);

    dragDistance.current = 0;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;

    dragDistance.current = walk;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.abs(dragDistance.current) > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex gap-3 w-full overflow-x-scroll overflow-y-hidden scrollbar-hide",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onClickCapture={handleClick}
    >
      {children}
    </div>
  );
};

export const ScrollItem = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  return <div className={cn("shrink-0", className)}>{children}</div>;
};

export default HorizontalScroll;
