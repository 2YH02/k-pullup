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
        "dark:text-white text-black w-full p-4 shadow-inner-full rounded-xl dark:border dark:border-solid dark:border-grey-dark resize-none focus:outline-none",
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
