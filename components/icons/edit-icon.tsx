import { type IconProps, iconStorkeColorMap } from "./home-icon";
import cn from "@lib/cn";

const EditIcon = ({ size = 25, color = "primary", className }: IconProps) => {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "dark:fill-grey-light",
        iconStorkeColorMap[color],
        className
      )}
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
};

export default EditIcon;
