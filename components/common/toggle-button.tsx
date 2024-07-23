import cn from "@/lib/cn";

interface ToggleButtonProps {
  /**
   * 초기 toggle 값
   */
  initValue?: boolean;
  /**
   * 버튼 사이즈
   */
  size?: "sm" | "md" | "lg";
  /**
   * true일 때 사용할 함수
   */
  onTrue: VoidFunction;
  /**
   * false일 때 사용할 함수
   */
  onFalse: VoidFunction;
}

const buttonSize = {
  sm: "w-9 h-5 after:top-[2px] after:start-[2px] after:h-4 after:w-4",
  md: "w-11 h-6 after:top-[2px] after:start-[2px] after:h-5 after:w-5",
  lg: "w-14 h-7 after:top-0.5 after:start-[4px] after:h-6 after:w-6",
};

const ToggleButton = ({
  initValue = false,
  size = "md",
  onTrue,
  onFalse,
}: ToggleButtonProps) => {
  const buttonStyle = buttonSize[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onTrue();
    } else {
      onFalse();
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultChecked={initValue}
        onChange={handleChange}
      />
      <div
        className={cn(
          `relative bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:transition-all dark:border-gray-600 peer-checked:bg-blue`,
          buttonStyle
        )}
      />
    </label>
  );
};

export default ToggleButton;
