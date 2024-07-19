import cn from "@lib/cn";

const typographyMap = {
  t1: "text-[30px] leading-[1.35]",
  t2: "text-[26px] leading-[1.34]",
  t3: "text-[22px] leading-[1.4]",
  t4: "text-[20px] leading-[1.45]",
  t5: "text-[16px] leading-[1.5]",
  t6: "text-[14px] leading-[1.5]",
  t7: "text-[12px] leading-[1.5]",
};

export type Typography = keyof typeof typographyMap;

interface TextProps {
  /**
   * 버튼 크기
   */
  typography?: Typography;
  display?: "inline" | "block" | "inline-block";
  /**
   * 버튼 정렬
   */
  textAlign?: "left" | "center" | "right";
  fontWeight?: "normal" | "bold" | "lighter" | "bolder";
  /**
   * tailwind 스타일 클래스 
   */
  className?: React.ComponentProps<"span">["className"];
  children?: React.ReactNode;
}

const Text = ({
  typography = "t5",
  display = "inline-block",
  textAlign = "left",
  fontWeight = "normal",
  className,
  children,
}: TextProps) => {
  const textStyle = cn(
    typographyMap[typography],
    display === "inline"
      ? "inline"
      : display === "block"
      ? "block"
      : "inline-block",
    textAlign === "left"
      ? "text-left"
      : textAlign === "center"
      ? "text-center"
      : "text-right",
    fontWeight === "normal"
      ? "font-normal"
      : fontWeight === "bold"
      ? "font-bold"
      : fontWeight === "lighter"
      ? "font-light"
      : "font-extrabold"
  );

  return (
    <span className={cn(textStyle, "text-black dark:text-white", className)}>
      {children}
    </span>
  );
};

export default Text;
