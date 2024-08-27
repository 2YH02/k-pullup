import { create } from "zustand";

interface SheetHeightStep {
  max: number;
  min: number;
  height: number;
}

interface SheetHeight {
  STEP_1: SheetHeightStep;
  STEP_2: SheetHeightStep;
  STEP_3: SheetHeightStep;
}

interface SheetHeightState {
  curHeight: number;
  curStyle: string;
  sheetHeight: SheetHeight;
  setSheetHeight: (sheetHeight: SheetHeight) => void;
  setCurHeight: (curHeight: number) => void;
  setCurStyle: (curStyle: string) => void;
}

const useSheetHeightStore = create<SheetHeightState>()((set) => ({
  curHeight: 85,
  curStyle: "mo:h-[85%]",
  sheetHeight: {
    STEP_1: { min: 0, max: 40, height: 30 },
    STEP_2: { min: 40, max: 70, height: 55 },
    STEP_3: { min: 70, max: 85, height: 85 },
  },
  setSheetHeight: (sheetHeight: SheetHeight) => set({ sheetHeight }),
  setCurHeight: (curHeight: number) => set({ curHeight }),
  setCurStyle: (curStyle: string) => set({ curStyle }),
}));

export default useSheetHeightStore;
