import cn from "@lib/cn";

export interface IconProps {
  size?: number | string;
  color?: "primary" | "black";
  className?: React.ComponentProps<"svg">["className"];
  link?: boolean;
}

export const iconColorMap = {
  primary: "fill-primary",
  black: "fill-black",
};
export const iconStorkeColorMap = {
  primary: "stroke-primary",
  black: "stroke-black",
};

const HomeIcon = ({ size = 25, color = "primary", className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M20,8h0L14,2.74a3,3,0,0,0-4,0L4,8a3,3,0,0,0-1,2.26V19a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V10.25A3,3,0,0,0,20,8ZM14,20H10V15a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm5-1a1,1,0,0,1-1,1H16V15a3,3,0,0,0-3-3H11a3,3,0,0,0-3,3v5H6a1,1,0,0,1-1-1V10.25a1,1,0,0,1,.34-.75l6-5.25a1,1,0,0,1,1.32,0l6,5.25a1,1,0,0,1,.34.75Z"
        className={cn("dark:fill-grey-light", iconColorMap[color], className)}
      />
    </svg>
  );
};

export default HomeIcon;
