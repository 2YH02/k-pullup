import cn from "@lib/cn";

interface GrowBoxProps {
  className?: string;
  children?: React.ReactNode;
}

const GrowBox = ({ className, children }: GrowBoxProps) => {
  return <div className={cn(className, "grow")}>{children}</div>;
};

export default GrowBox;
