import cn from "@/lib/cn";
import useIsMounted from "@hooks/useIsMounted";
import { useBottomSheetStore } from "@store/useBottomSheetStore";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BsX } from "react-icons/bs";
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
          "absolute bottom-0 left-0 w-full bg-white dark:bg-black z-50 p-4 rounded-t-3xl duration-100",
          active ? "translate-y-0" : "translate-y-full",
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
        {title && (
          <div className="flex justify-between items-center mb-4">
            <Text className="text-xl font-semibold">{title}</Text>
            <button
              className="p-1 rounded-full bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(255,255,255,0.4)] text-white dark:text-black"
              onClick={hide}
            >
              <BsX size={26} />
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
  children,
}: React.PropsWithChildren<{
  onClick?: VoidFunction;
  disabled?: boolean;
  icon?: React.ReactElement;
}>) => {
  return (
    <button
      className="p-3 w-full flex items-center active:bg-[rgba(0,0,0,0.1)] rounded-lg"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="mr-4 p-2 rounded-full bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(255,255,255,0.2)] text-white">
        {icon}
      </span>
      <Text>{children}</Text>
    </button>
  );
};

export default BottomSheet;
