import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const RankingIcon = ({
  size = 25,
  color = "primary",
  className,
  link,
}: IconProps) => {
  const style1 = link
    ? "stroke-grey-dark dark:stroke-[#555]"
    : "dark:fill-grey-light";
  const style2 = link ? "fill-[#6DC5D1]" : "";
  const style3 = link ? "fill-coral" : "";

  return (
    <svg
      enableBackground="new 0 0 64 64"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn(style1, link ? "" : iconColorMap[color], className)}
    >
      <g>
        <path
          d="M61,45h-3V21c0-1.1044922-0.8955078-2-2-2H45V9c0-1.1044922-0.8955078-2-2-2H21c-1.1044922,0-2,0.8955078-2,2v6H9   c-1.1044922,0-2,0.8955078-2,2v28H3c-1.1044922,0-2,0.8955078-2,2v8c0,1.1044922,0.8955078,2,2,2h58c1.1044922,0,2-0.8955078,2-2   v-8C63,45.8955078,62.1044922,45,61,45z M11,19h8v18c0,1.1044922,0.8955078,2,2,2s2-0.8955078,2-2V11h18v16   c0,1.1044922,0.8955078,2,2,2s2-0.8955078,2-2v-4h9v22h-9V34c0-1.1044922-0.8955078-2-2-2s-2,0.8955078-2,2v11H23v-1   c0-1.1044922-0.8955078-2-2-2s-2,0.8955078-2,2v1h-8V19z M59,53H5v-4h4h12h22h13h3V53z"
          className={style2}
        />
        <path
          d="M29,28c-1.1044922,0-2,0.8955078-2,2s0.8955078,2,2,2h6c1.1044922,0,2-0.8955078,2-2s-0.8955078-2-2-2h-1V18   c0-0.7578125-0.4282227-1.4501953-1.1054688-1.7890625c-0.6782227-0.3388672-1.4882813-0.2666016-2.0947266,0.1894531l-3,2.25   c-0.8833008,0.6621094-1.0625,1.9160156-0.3999023,2.7998047c0.6142578,0.8173828,1.7348633,1.03125,2.6000977,0.5322266V28H29z"
          className={style3}
        />
      </g>
    </svg>
  );
};

export default RankingIcon;
