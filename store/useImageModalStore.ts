import { create } from "zustand";

interface ImageModalState {
  images: string[];
  curIndex: number;
  open: boolean;
  openModal: ({
    images,
    curIndex,
  }: {
    images: string[];
    curIndex?: number;
  }) => void;
  closeModal: () => void;
}

const useImageModalStore = create<ImageModalState>()((set) => ({
  images: [],
  curIndex: 0,
  open: false,
  openModal: ({ images, curIndex }: { images: string[]; curIndex?: number }) =>
    set({ images, curIndex: curIndex || 0, open: true }),
  closeModal: () => set({ images: [], open: false }),
}));

export default useImageModalStore;
