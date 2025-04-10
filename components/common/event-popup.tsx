"use client";

import cn from "@lib/cn";
import Link from "next/link";
import { useState } from "react";
import Dimmed from "./dimmed";
import Skeleton from "./skeleton";

interface EventPopupProps {
  showDoNotShowToday?: boolean;
  onClose: (doNotShowToday?: boolean) => void;
}

const EventPopup = ({
  onClose,
  showDoNotShowToday = true,
}: EventPopupProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [doNotShowToday, setDoNotShowToday] = useState(false);

  const handleClose = () => {
    onClose(doNotShowToday);
  };

  return (
    <Dimmed onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-black rounded-lg shadow-lg p-4 max-w-md w-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-black dark:text-white">
            이벤트 안내
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mb-3">
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfOoEacqoZCA0t5EF2WrLl0odPpeWlW1inDeS84JoTKMu-Jfw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            {!imageLoaded && <Skeleton className="w-full h-80 " />}
            <img
              src="/popup.png"
              alt="이벤트 이미지"
              className={cn(
                "rounded-md object-cover w-full",
                imageLoaded ? "block" : "hidden"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </Link>
          {/* <p className="text-xs text-grey-dark">
            특별 이벤트를 놓치지 마세요! 지금 바로 확인하세요.
          </p> */}
        </div>

        <div className="flex justify-between gap-3">
          {showDoNotShowToday && (
            <div className="flex items-center">
              <input
                id="do-not-show"
                type="checkbox"
                checked={doNotShowToday}
                onChange={(e) => setDoNotShowToday(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label
                htmlFor="do-not-show"
                className="ml-2 text-sm text-gray-600"
              >
                오늘 하루 보지 않기
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
            >
              닫기
            </button>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSfOoEacqoZCA0t5EF2WrLl0odPpeWlW1inDeS84JoTKMu-Jfw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary bg-opacity-80 hover:bg-opacity-100 text-white rounded-md transition-colors"
            >
              자세히 보기
            </Link>
          </div>
        </div>
      </div>
    </Dimmed>
  );
};

export default EventPopup;
