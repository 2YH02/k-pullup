import { create } from "zustand";
import type { User } from "@/types/user";

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  isLoading: true,
  setUser: (user: User | null) => set({ user }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useUserStore;
