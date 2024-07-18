interface InputProps extends React.ComponentProps<"input"> {
  isInvalid: boolean;
  icon?: React.ReactNode;
}
// TODO: Input 컴포넌트 스토리 추가
// TODO: Input field 컴포넌트, 스토리 추가
// TODO: div onClick Props 추가

const Input = ({ isInvalid, icon, ...props }: InputProps) => {
  return (
    <div className="relative w-full">
      <input
        className={`h-10 w-full px-4 pr-10 text-base font-medium border border-coral rounded-3xl focus:outline-none focus:border-coral-dark ${
          isInvalid ? "border-red" : ""
        } dark:bg-grey-dark dark:border-grey dark:focus:border-grey-light dark:text-white`}
        aria-invalid={isInvalid}
        {...props}
      />
      {icon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {icon}
        </span>
      )}
    </div>
  );
};

export default Input;
