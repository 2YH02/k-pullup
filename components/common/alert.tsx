"use client";

import LoadingIcon from "@icons/loading-icon";
import useAlertStore from "@store/useAlertStore";
import { useEffect, useId, useRef, useState } from "react";
import Button from "./button";
import Dimmed from "./dimmed";
import Text from "./text";

interface Props {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: string;
  cancel?: boolean;
  contents?: React.ReactNode;
  onClick?: VoidFunction;
  onClickAsync?: () => Promise<void>;
}

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const Alert = ({
  open,
  title,
  description,
  buttonLabel = "확인",
  cancel,
  contents,
  onClick,
  onClickAsync,
}: Props) => {
  const { closeAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    // 열릴 때: 이전 포커스 저장 → 내부 첫 번째 포커스 가능 요소로 이동
    previousFocusRef.current = document.activeElement as HTMLElement;

    const firstFocusable =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable || dialogRef.current)?.focus();

    // 키보드 핸들러
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAlert();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;

        const focusables =
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // 닫힐 때: 이전 포커스 복원
      previousFocusRef.current?.focus();
    };
  }, [open, closeAlert]);

  if (!open) return null;

  const handleClick = async () => {
    if (onClickAsync) {
      setLoading(true);
      try {
        await onClickAsync();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else if (onClick) {
      onClick();
    }
  };

  if (contents) {
    return (
      <Dimmed onClose={closeAlert}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
          overflow-hidden bg-white dark:bg-black rounded-lg z-40"
        >
          {contents}
        </div>
      </Dimmed>
    );
  }

  return (
    <Dimmed onClose={closeAlert}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
        overflow-hidden bg-white dark:bg-black rounded-lg z-40"
      >
        <Text
          id={titleId}
          typography="t4"
          fontWeight="bold"
          display="block"
          className="mb-2"
        >
          {title}
        </Text>

        {description && <Text typography="t6">{description}</Text>}

        {(onClick || cancel) && (
          <div className="flex justify-end mt-3">
            <div className="flex">
              {cancel && (
                <Button
                  onClick={closeAlert}
                  size="sm"
                  variant="contrast"
                  className="flex items-center justify-center w-16 h-8 p-0"
                >
                  취소
                </Button>
              )}
              {(onClick || onClickAsync) && (
                <Button
                  onClick={handleClick}
                  size="sm"
                  className="ml-2 flex items-center justify-center w-16 h-8 p-0"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingIcon size="sm" className="mr-0 ml-0 text-white" />
                  ) : (
                    buttonLabel
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Dimmed>
  );
};

export default Alert;
