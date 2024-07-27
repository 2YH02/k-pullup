import { create } from "zustand";
import type { User } from "@/types/user";
interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default useUserStore;
