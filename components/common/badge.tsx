import cn from "@lib/cn";
import Text from "./text";

interface BadgeProps {
  /**
   * badge 아이콘
   */
  icon?: React.ReactNode;
  /**
   * badge 텍스트
   */
  text: string;
  /**
   * border 유 / 무
   */
  withBorder?: boolean;
  /**
   * tailwind 스타일 클래스
   */
  className?: React.ComponentProps<"span">["className"];
  /**
   * tailwind 스타일 클래스 (for Text)
   */
  textStyle?: React.ComponentProps<"span">["className"];
  /**
   * 버튼으로 동작
   */
  isButton?: boolean;
  /**
   * 클릭 이벤트 함수
   */
  onClick?: () => void;
}

const Badge = ({
  icon,
  text,
  withBorder = true,
  isButton = false,
  className,
  textStyle,
  onClick,
}: BadgeProps) => {
  const Component = isButton ? "button" : "span";

  return (
    <Component
      className={cn(
        `${
          withBorder ? "border border-primary-dark border-solid" : ""
        } px-4 py-1 rounded-3xl inline-block select-none bg-search-input-bg/65 dark:bg-black/35 text-text-on-surface dark:text-grey-light transition-colors duration-150 ${
          isButton
            ? "cursor-pointer active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35"
            : ""
        }`,
        className
      )}
      onClick={isButton ? onClick : undefined}
    >
      <div className="flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        <Text typography="t6" fontWeight="bold" className={cn("text-inherit", textStyle)}>
          {text}
        </Text>
      </div>
    </Component>
  );
};

export default Badge;
