import cn from "@lib/cn";

interface DividerProps {
  orientation?: "vertical" | "horizontal";
  className?: React.ComponentProps<"div">["className"];
}

const Divider = ({ orientation, className }: DividerProps) => {
  return (
    <div
      className={cn(
        `bg-grey-light dark:bg-grey-dark ${
          orientation === "vertical" ? "h-auto" : "w-auto"
        }`,
        className
      )}
    />
  );
};

export default Divider;
