import cn from "@/lib/cn";
import Button, { type ButtonProps } from "./button";

interface BottomFixedButtonProps extends ButtonProps {
  containerStyle?: React.ComponentProps<"div">["className"];
}

const BottomFixedButton = ({
  containerStyle,
  ...props
}: BottomFixedButtonProps) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 p-4 w-full bg-white dark:bg-black",
        containerStyle
      )}
    >
      <Button {...props} full>
        다음
      </Button>
    </div>
  );
};

export default BottomFixedButton;
