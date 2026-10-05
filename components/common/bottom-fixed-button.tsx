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
        "sticky bottom-0 z-10 w-full border-t border-primary/10 bg-side-main/95 p-4 backdrop-blur-xs dark:border-grey-dark dark:bg-black/90",
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
