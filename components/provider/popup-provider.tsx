"use client";

import useEventPopup from "@/hooks/useEventPopup";
import EventPopup from "../common/event-popup";

const PopupProvider = ({ children }: React.PropsWithChildren) => {
  const { showPopup, closePopup } = useEventPopup("main-event");

  const handleClosePopup = (doNotShowToday?: boolean) => {
    closePopup(doNotShowToday);
  };

  return (
    <>
      {children}

      {showPopup && (
        <EventPopup
          onClose={(doNotShowToday) => handleClosePopup(doNotShowToday)}
          showDoNotShowToday={true}
        />
      )}
    </>
  );
};

export default PopupProvider;
