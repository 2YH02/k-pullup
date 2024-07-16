import Navigate from "@layout/navigate";
import cn from "@lib/cn";
import Text from "./text";

interface SideMainProps {
  title?: string;
  withNav?: boolean;
  clasName?: string;
  children?: React.ReactNode;
}

const SideMain = ({ title, withNav, clasName, children }: SideMainProps) => {
  return (
    <main
      className={cn(
        "absolute top-6 bottom-6 left-6 w-96 bg-grey-light px-4 rounded-lg translate-x-0 overflow-y-auto overflow-x-hidden scrollbar-thin shadow-md dark:bg-black",
        clasName
      )}
    >
      <div className={`${withNav ? "pb-10" : ""} min-h-[calc(100%-56px)]`}>
        <Text
          typography="t3"
          display="block"
          textAlign="center"
          className="mt-4"
        >
          {title}
        </Text>
        {children}
      </div>
      {withNav && <Navigate />}
    </main>
  );
};

export default SideMain;
