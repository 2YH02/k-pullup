import cn from "@lib/cn";

interface ShadowBoxProps {
  withAction?: boolean;
  className?: React.ComponentProps<"div">["className"];
  onClick?: VoidFunction;
  children: React.ReactNode;
}

const ShadowBox = ({
  withAction,
  className,
  onClick,
  children,
}: ShadowBoxProps) => {
  const actionStyle = withAction ? "web:hover:shadow-simple-primary" : "";
  const Container = onClick ? "button" : "div";
  return (
    <Container
      className={cn(
        `shadow-simple p-1 rounded-lg border border-solid border-grey-light dark:border-none dark:bg-black-light`,
        actionStyle,
        className
      )}
      onClick={onClick ? onClick : undefined}
    >
      {children}
    </Container>
  );
};

export default ShadowBox;
