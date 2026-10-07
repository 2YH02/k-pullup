import cn from "@/lib/cn";

interface ToggleButtonProps {
  /**
   * 스크린 리더에서 사용할 토글 이름
   */
  ariaLabel?: string;
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
  ariaLabel = "설정 전환",
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
    <label className="inline-flex cursor-pointer items-center rounded-full focus-within:ring-2 focus-within:ring-primary/25">
      <input
        type="checkbox"
        aria-label={ariaLabel}
        className="sr-only peer"
        defaultChecked={initValue}
        onChange={handleChange}
      />
      <div
        className={cn(
          `relative rounded-full bg-grey-light peer peer-focus:outline-hidden dark:bg-grey-dark
        peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:rtl:after:-translate-x-full
        after:absolute after:rounded-full after:border after:border-grey after:bg-white after:transition-all after:content-['']
        dark:after:border-grey-dark dark:peer-checked:bg-primary-dark`,
          buttonStyle
        )}
      />
    </label>
  );
};

export default ToggleButton;
