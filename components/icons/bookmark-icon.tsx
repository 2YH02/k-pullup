import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const BookmarkIcon = ({
  size = 25,
  color = "primary",
  className,
  link,
}: IconProps) => {
  const style = link ? "stroke-grey-dark fill-beige dark:stroke-[#555]" : "dark:fill-grey-light";

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn(style, link ? "" : iconColorMap[color], className)}
    >
      <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19c0-.101.009-.191.024-.273.112-.576.584-.717.988-.727H21V4a2 2 0 0 0-2-2zm0 9-2-1-2 1V4h4v7z" />
    </svg>
  );
};

export default BookmarkIcon;
