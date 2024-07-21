import { type IconProps, iconColorMap } from "./home-icon";
import cn from "@lib/cn";

const LocationPinIcon = ({
  size = 25,
  color = "primary",
  className,
}: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M12.6577283,22.7532553 L12,23.3275712 L11.3422717,22.7532553 C5.81130786,17.9237218 3,13.70676 3,10 C3,4.7506636 7.09705254,1 12,1 C16.9029475,1 21,4.7506636 21,10 C21,13.70676 18.1886921,17.9237218 12.6577283,22.7532553 Z M5,10 C5,12.8492324 7.30661202,16.4335466 12,20.6634039 C16.693388,16.4335466 19,12.8492324 19,10 C19,5.8966022 15.8358849,3 12,3 C8.16411512,3 5,5.8966022 5,10 Z M11,9 L11,6 L13,6 L13,9 L16,9 L16,11 L13,11 L13,14 L11,14 L11,11 L8,11 L8,9 L11,9 Z"
        fillRule="evenodd"
        className={cn("dark:fill-grey-light", iconColorMap[color], className)}
      />
    </svg>
  );
};

export default LocationPinIcon;
