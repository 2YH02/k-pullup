import cn from "@/lib/cn";
import GrowBox from "./grow-box";
import Text from "./text";

interface SectionProps {
  children?: React.ReactNode;
  className?: React.ComponentProps<"section">["className"];
}

const Section = ({ className, children }: SectionProps) => {
  return (
    <section className={cn("py-4 px-6 bg-side-main dark:bg-black", className)}>
      {children}
    </section>
  );
};

export const SectionTitle = ({
  title,
  subTitle,
  buttonTitle,
  onClickButton,
}: {
  title: string;
  subTitle?: string;
  buttonTitle?: string;
  onClickButton?: VoidFunction;
}) => {
  return (
    <Text
      className="mb-2 select-none flex items-center"
      typography="t5"
      fontWeight="bold"
    >
      <p className="text-text-on-surface dark:text-grey-light">{title}</p>
      {subTitle && (
        <p className="text-[10px] ml-2 text-text-on-surface-muted dark:text-grey">
          {subTitle}
        </p>
      )}
      <GrowBox />
      <button
        className="text-[10px] text-primary underline font-normal transition-colors duration-150 active:text-primary-dark focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 rounded-sm"
        onClick={onClickButton}
      >
        {buttonTitle}
      </button>
    </Text>
  );
};

export default Section;
