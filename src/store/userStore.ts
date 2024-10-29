import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
  profileUrl?: string;
  isVerified: boolean;
  oauthProvider?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));