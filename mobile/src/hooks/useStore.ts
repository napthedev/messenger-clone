import { UserType } from "server/src/user/user.service";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface Store {
  user: undefined | null | UserType;
  setUser: (newUser: undefined | null | UserType) => void;
  isModalOpened: boolean;
  setIsModalOpened: (value: boolean) => void;
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useStore = create<Store>((set) => ({
  user: undefined,
  setUser: (newUser) => set({ user: newUser }),
  isModalOpened: false,
  setIsModalOpened: (value) => set({ isModalOpened: value }),
  socket: null,
  setSocket: (socket) => set({ socket }),
}));
