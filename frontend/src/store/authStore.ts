import { create } from "zustand";
import type { User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  logout: () => void;
};

const saved = (() => {
  try {
    const raw = window.localStorage.getItem("scheduler_auth");
    return raw ? (JSON.parse(raw) as Pick<AuthState, "user" | "token">) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
})();

export const useAuthStore = create<AuthState>((set) => ({
  user: saved.user,
  token: saved.token,
  setSession: (user, token) => {
    window.localStorage.setItem("scheduler_auth", JSON.stringify({ user, token }));
    set({ user, token });
  },
  logout: () => {
    window.localStorage.removeItem("scheduler_auth");
    set({ user: null, token: null });
  }
}));
