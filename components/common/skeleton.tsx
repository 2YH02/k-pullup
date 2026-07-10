import cn from "@lib/cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-grey-light/60 dark:bg-grey-dark/40 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
