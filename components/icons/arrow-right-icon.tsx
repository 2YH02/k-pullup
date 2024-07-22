import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const ArrowRightIcon = ({
  size = 25,
  color = "primary",
  className,
}: IconProps) => {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M202.1,450a15,15,0,0,1-10.6-25.61L365.79,250.1,191.5,75.81A15,15,0,0,1,212.71,54.6l184.9,184.9a15,15,0,0,1,0,21.21l-184.9,184.9A15,15,0,0,1,202.1,450Z"
        className={cn("dark:fill-grey-light", iconColorMap[color], className)}
      />
    </svg>
  );
};

export default ArrowRightIcon;
