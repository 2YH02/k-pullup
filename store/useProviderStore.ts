import { Comment } from "@api/comment/get-comments";
import { create } from "zustand";

interface ProviderState {
  providerInfo: Comment[];
  setProviderInfo: (info: Comment[]) => void;
  clearProviderInfo: () => void;
}

export const useProviderStore = create<ProviderState>((set) => ({
  providerInfo: [],
  setProviderInfo: (info) => set({ providerInfo: info }),
  clearProviderInfo: () => set({ providerInfo: [] }),
}));
