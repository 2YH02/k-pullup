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
  onClick,
  className,
}: BadgeProps) => {
  const Component = isButton ? "button" : "span";

  return (
    <Component
      className={cn(
        `${
          withBorder ? "border border-primary-dark border-solid" : ""
        } px-2 py-1 rounded-3xl inline-block select-none`,
        className
      )}
      onClick={isButton ? onClick : undefined}
    >
      <div className="flex items-center justify-center">
        {icon && <span className="mr-1">{icon}</span>}
        <Text typography="t6" fontWeight="bold">
          {text}
        </Text>
      </div>
    </Component>
  );
};

export default Badge;
