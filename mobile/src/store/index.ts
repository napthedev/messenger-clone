import { create } from "zustand";

interface User {
  id: string;
  username: string;
  avatar?: string;
  displayName: string;
}

interface Store {
  user: undefined | null | User;
  setUser: (newUser: undefined | null | User) => void;
}

export const useStore = create<Store>((set) => ({
  user: undefined,
  setUser: (newUser) => set({ user: newUser }),
}));
