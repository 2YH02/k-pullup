import cn from "@lib/cn";
import Text from "./text";

interface IconButtonProps {
  icon: React.ReactNode;
  text?: React.ReactNode;
  className?: React.ComponentProps<"button">["className"];
  onClick?: VoidFunction;
}

const IconButton = ({ icon, text, className, onClick }: IconButtonProps) => {
  return (
    <button
      className={cn("w-[55px] h-[55px] flex flex-col items-center justify-center rounded-md gap-1", className)}
      onClick={onClick}
    >
      <div>{icon}</div>
      {text && <Text typography="t7">{text}</Text>}
    </button>
  );
};

export default IconButton;
