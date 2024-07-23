import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const ChatBubbleIcon = ({
  size = 25,
  color = "primary",
  className,
  link,
}: IconProps) => {
  const style = link
    ? "stroke-grey-dark fill-[#88D66C] dark:stroke-[#555]"
    : "dark:fill-grey-light";

  return (
    <svg
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M40 4H8C5.79 4 4.02 5.79 4.02 8L4 44l8-8h28c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zM12 18h24v4H12v-4zm16 10H12v-4h16v4zm8-12H12v-4h24v4z"
        className={cn(style, link ? "" : iconColorMap[color], className)}
      />
      <path d="M0 0h48v48H0z" fill="none" />
    </svg>
  );
};

export default ChatBubbleIcon;
