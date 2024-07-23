import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const LocationPinIcon = ({
  size = 25,
  color = "primary",
  className,
  link,
}: IconProps) => {
  const style = link
    ? "stroke-grey-dark fill-[#E49BFF] dark:stroke-[#555]"
    : "dark:fill-grey-light";
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={cn(style, link ? "" : iconColorMap[color], className)}
    >
      <path
        clipRule="evenodd"
        d="M13.404 21.373C15.6987 18.5858 20 12.7696 20 8.33333C20 4.28325 16.4183 1 12 1C7.58172 1 4 4.28325 4 8.33333C4 12.7696 8.30134 18.5858 10.596 21.373C11.3352 22.2708 12.6648 22.2708 13.404 21.373ZM12 5C12.5523 5 13 5.44772 13 6V8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H13V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V10H9C8.44772 10 8 9.55228 8 9C8 8.44771 8.44772 8 9 8H11V6C11 5.44772 11.4477 5 12 5Z"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default LocationPinIcon;
