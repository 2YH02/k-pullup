import cn from "@/lib/cn";
import Text from "./text";

interface SectionProps {
  children?: React.ReactNode;
  className?: React.ComponentProps<"section">["className"];
}

const Section = ({ className, children }: SectionProps) => {
  return (
    <section className={cn("p-4 bg-white dark:bg-black", className)}>
      {children}
    </section>
  );
};

export const SectionTitle = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) => {
  return (
    <Text
      className="mb-2 select-none flex items-center"
      typography="t5"
      fontWeight="bold"
    >
      <p>{title}</p>
      {subTitle && <p className="text-[10px] ml-2 text-grey">{subTitle}</p>}
    </Text>
  );
};

export default Section;
