import cn from "@lib/cn";

const typographyMap = {
  t1: "text-[28px] leading-[1.25] tracking-tight",
  t2: "text-[24px] leading-[1.28] tracking-tight",
  t3: "text-[20px] leading-[1.32] tracking-tight",
  t4: "text-[18px] leading-[1.35] tracking-[-0.01em]",
  t5: "text-[15px] leading-[1.45] tracking-[-0.01em]",
  t6: "text-[13px] leading-[1.45]",
  t7: "text-[11px] leading-[1.4]",
};

export type Typography = keyof typeof typographyMap;

interface TextProps extends React.ComponentProps<"span"> {
  /**
   * 버튼 크기
   */
  typography?: Typography;
  display?: "inline" | "block" | "inline-block";
  /**
   * 버튼 정렬
   */
  textAlign?: "left" | "center" | "right";
  fontWeight?: "normal" | "medium" | "semibold" | "bold" | "lighter" | "bolder";
}

const Text = ({
  typography = "t5",
  display = "inline-block",
  textAlign = "left",
  fontWeight = "normal",
  className,
  children,
  ...props
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
      : fontWeight === "medium"
      ? "font-medium"
      : fontWeight === "semibold"
      ? "font-semibold"
      : fontWeight === "bold"
      ? "font-semibold"
      : fontWeight === "lighter"
      ? "font-light"
      : "font-bold"
  );

  return (
    <span className={cn(textStyle, "text-text-on-surface dark:text-grey-light", className)} {...props}>
      {children}
    </span>
  );
};

export default Text;
