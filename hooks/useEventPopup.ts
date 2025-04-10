import { useState, useEffect } from "react";

const useEventPopup = (popupId = "event-popup") => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    checkIfShouldShowPopup();
  }, []);

  const checkIfShouldShowPopup = () => {
    if (typeof window !== "undefined") {
      const storageKey = `${popupId}-expiry`;
      const expiryDate = localStorage.getItem(storageKey);
      const today = new Date().toDateString();

      if (!expiryDate || expiryDate !== today) {
        setShowPopup(true);
      }
    }
  };

  const closePopup = (doNotShowToday = false) => {
    if (doNotShowToday) {
      const storageKey = `${popupId}-expiry`;
      const today = new Date();
      const expiryDate = today.toDateString();
      localStorage.setItem(storageKey, expiryDate);
    }
    setShowPopup(false);
  };

  return {
    showPopup,
    closePopup,
  };
};

export default useEventPopup;
