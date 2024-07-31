import { create } from "zustand";

interface SheetHeightState {
  sheetHeight: number;
  setSheetHeight: (sheetHeight: number) => void;
}

const useSheetHeightStore = create<SheetHeightState>()((set) => ({
  sheetHeight: 85,
  setSheetHeight: (sheetHeight: number) => set({ sheetHeight }),
}));

export default useSheetHeightStore;
