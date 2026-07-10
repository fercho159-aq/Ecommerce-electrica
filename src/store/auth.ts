import { create } from "zustand";

const ADMIN_USER = "admin@electricasanmiguel.com.mx";
const ADMIN_PASS = "ESM2026admin";

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email, password) => {
    if (email === ADMIN_USER && password === ADMIN_PASS) {
      set({ isAuthenticated: true, user: email });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
