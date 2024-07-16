import cn from "@lib/cn";
import Text from "./text";

interface SideMainProps {
  title?: string;
  clasName?: string;
  children?: React.ReactNode;
}

const SideMain = ({ title, clasName, children }: SideMainProps) => {
  return (
    <main
      className={cn(
        "absolute top-6 bottom-6 left-6 w-96 bg-grey-light p-4 rounded-lg overflow-auto scrollbar-thin dark:bg-black",
        clasName
      )}
    >
      <Text typography="t3" display="block" textAlign="center">
        {title}
      </Text>
      {children}
    </main>
  );
};

export default SideMain;
