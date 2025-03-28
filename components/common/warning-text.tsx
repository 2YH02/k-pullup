import cn from "@lib/cn";
import { BsExclamationTriangle } from "react-icons/bs";

const WarningText = ({
  className,
  children,
}: React.PropsWithChildren<{
  className?: React.ComponentProps<"div">["className"];
}>) => {
  return (
    <div
      className={cn(
        "text-sm text-yellow dark:text-yellow-dark flex items-start",
        className
      )}
    >
      <div className="mr-2 mt-1">
        <BsExclamationTriangle />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default WarningText;
