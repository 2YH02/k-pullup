"use client";

import LoadingIcon from "@icons/loading-icon";
import useAlertStore from "@store/useAlertStore";
import { useState } from "react";
import Button from "./button";
import Dimmed from "./dimmed";
import Text from "./text";

interface Props {
  open?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  buttonLabel?: string;
  cancel?: boolean;
  onClick?: VoidFunction;
  onClickAsync?: () => Promise<void>;
}

const Alert = ({
  open,
  title,
  description,
  buttonLabel = "확인",
  cancel,
  onClick,
  onClickAsync,
}: Props) => {
  const { closeAlert } = useAlertStore();
  const [loading, setLoading] = useState(false);

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

  return (
    <Dimmed onClose={closeAlert}>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 p-6
        overflow-hidden bg-white dark:bg-black rounded-lg z-40"
      >
        <Text
          typography="t4"
          fontWeight="bold"
          display="block"
          className="mb-2"
        >
          {title}
        </Text>

        {description && <Text typography="t7">{description}</Text>}

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
