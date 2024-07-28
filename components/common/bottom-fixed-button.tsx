import cn from "@/lib/cn";
import Button, { type ButtonProps } from "./button";

interface BottomFixedButtonProps extends ButtonProps {
  containerStyle?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
}

const BottomFixedButton = ({
  containerStyle,
  children,
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
        {children}
      </Button>
    </div>
  );
};

export default BottomFixedButton;
