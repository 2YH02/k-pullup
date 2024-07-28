import cn from "@/lib/cn";

interface ShadowBoxProps {
  withAction?: boolean;
  className?: React.ComponentProps<"div">["className"];
  children: React.ReactNode;
}

const ShadowBox = ({ withAction, className, children }: ShadowBoxProps) => {
  const actionStyle = withAction ? "hover:shadow-simple-primary" : "";
  return (
    <div
      className={cn(
        `shadow-simple p-1 rounded-lg border border-solid border-grey-light dark:border-none dark:bg-black-light`,
        actionStyle,
        className
      )}
    >
      {children}
    </div>
  );
};

export default ShadowBox;
