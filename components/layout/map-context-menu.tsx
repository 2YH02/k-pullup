"use client";

import { memo } from "react";
import { BsFillPinMapFill } from "react-icons/bs";

interface MapContextMenuProps {
  x: number;
  y: number;
  onRoadview: () => void;
  onClose: () => void;
}

const MapContextMenu = memo(({ x, y, onRoadview, onClose }: MapContextMenuProps) => {
  const handleRoadview = () => {
    onRoadview();
    onClose();
  };

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-60"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      {/* Context Menu */}
      <div
        className="fixed select-none z-61 bg-white dark:bg-black-light rounded-lg shadow-lg border border-grey-light dark:border-grey-dark overflow-hidden min-w-[160px]"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        <button
          onClick={handleRoadview}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-grey-light dark:hover:bg-grey-dark transition-colors text-left"
        >
          <BsFillPinMapFill size={18} className="fill-primary shrink-0" />
          <span className="text-black dark:text-grey-light text-sm font-medium">
            로드뷰 보기
          </span>
        </button>

        {/* Future menu items can be added here */}
        {/* <button className="...">다른 옵션</button> */}
      </div>
    </>
  );
});

MapContextMenu.displayName = "MapContextMenu";

export default MapContextMenu;
