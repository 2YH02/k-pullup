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

export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <Text className="mb-2" typography="t5" fontWeight="bold">
      {title}
    </Text>
  );
};

export default Section;
