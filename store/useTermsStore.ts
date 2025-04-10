import { create } from "zustand";

interface TermsState {
  isTermsAgreed: boolean;
  setIsTermsAgreed: (isTermsAgreed: boolean) => void;
}

const useTermsStore = create<TermsState>()((set) => ({
  isTermsAgreed: false,
  setIsTermsAgreed: (isTermsAgreed: boolean) => set({ isTermsAgreed }),
}));

export default useTermsStore;
