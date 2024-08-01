import cn from "@lib/cn";

interface InputProps {
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  value?: string;
  className?: React.ComponentProps<"textarea">["className"];
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({
  className,
  maxLength = 40,
  rows = 4,
  placeholder,
  value,
  onChange,
}: InputProps) => {
  return (
    <textarea
      className={cn(
        "border border-primary focus:border-primary-dark bg-white dark:bg-black dark:text-white text-black w-full p-2 rounded resize-none focus:outline-none",
        className
      )}
      maxLength={maxLength}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    ></textarea>
  );
};

export default Textarea;
