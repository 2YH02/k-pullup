import cn from "@/lib/cn";
import useIsMounted from "@hooks/useIsMounted";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Dimmed from "./dimmed";
import Text from "./text";

interface BottomSheetProps {
  title?: string;
  id: string;
  className?: React.ComponentProps<"div">["className"];
}

const BottomSheet = ({
  title,
  id,
  className,
  children,
}: React.PropsWithChildren<BottomSheetProps>) => {
  const isMounted = useIsMounted();
  const { isView, hide, id: modalId } = useBottomSheetStore();

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!isView) {
      setActive(false);
      return;
    }

    const timeout = setTimeout(() => {
      setActive(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, [isView]);

  if (!isMounted || !isView || id !== modalId) return null;

  return createPortal(
    <Dimmed onClose={hide}>
      <div
        className={cn(
          "absolute bottom-0 left-0 z-50 w-full rounded-t-3xl border-t border-grey-light/85 bg-side-main p-4 text-text-on-surface shadow-[0_-8px_24px_rgba(0,0,0,0.12)] transition-[transform,opacity] duration-180 ease-out motion-reduce:transition-none dark:border-grey-dark/85 dark:bg-black dark:text-grey-light",
          active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseMove={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-grey-light dark:bg-grey-dark" />
        {title && (
          <div className="mb-4 flex items-center justify-between">
            <Text className="text-xl font-semibold text-text-on-surface dark:text-grey-light">
              {title}
            </Text>
            <button
              className="rounded-full border border-grey-light/80 bg-search-input-bg/60 p-1 text-text-on-surface transition-colors duration-150 active:scale-[0.96] active:bg-search-input-bg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 dark:border-grey-dark/80 dark:bg-black/35 dark:text-grey-light dark:active:bg-black/55"
              onClick={hide}
              aria-label="바텀시트 닫기"
            >
              <X size={22} strokeWidth={2.3} />
            </button>
          </div>
        )}

        {children}
      </div>
    </Dimmed>,
    document.body
  );
};

export const BottomSheetItem = ({
  onClick,
  disabled,
  icon,
  iconWrapClassName,
  className,
  children,
}: React.PropsWithChildren<{
  onClick?: VoidFunction;
  disabled?: boolean;
  icon?: React.ReactElement;
  iconWrapClassName?: React.ComponentProps<"span">["className"];
  className?: React.ComponentProps<"button">["className"];
}>) => {
  return (
    <button
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2.5 text-text-on-surface transition-colors duration-150 active:scale-[0.99] active:bg-search-input-bg/75 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/35 disabled:cursor-not-allowed disabled:opacity-45 dark:text-grey-light dark:active:bg-grey-dark/35",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={cn(
          "mr-3 rounded-full border border-grey-light/85 bg-search-input-bg/65 p-2 text-text-on-surface dark:border-grey-dark/80 dark:bg-black/35 dark:text-grey-light",
          iconWrapClassName
        )}
      >
        {icon}
      </span>
      <Text className="text-inherit">{children}</Text>
    </button>
  );
};

export default BottomSheet;
