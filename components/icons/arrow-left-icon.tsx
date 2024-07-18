import type { IconProps } from "./home-icon";

const ArrowLeftIcon = ({ size = 25, color = "#f29992" }: IconProps) => {
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M11.262,16.714l9.002,8.999  c0.395,0.394,1.035,0.394,1.431,0c0.395-0.394,0.395-1.034,0-1.428L13.407,16l8.287-8.285c0.395-0.394,0.395-1.034,0-1.429  c-0.395-0.394-1.036-0.394-1.431,0l-9.002,8.999C10.872,15.675,10.872,16.325,11.262,16.714z"
        fill={color}
        className="dark:fill-grey-light"
      />
    </svg>
  );
};

export default ArrowLeftIcon;
