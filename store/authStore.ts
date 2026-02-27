import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RegisteredUser } from "@/types/product";

const USERS_KEY = "sf_registered_users";

function getStoredUsers(): RegisteredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: RegisteredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

type AuthState = {
  token: string | null;
  email: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  register: (email: string, username: string, password: string) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      username: null,
      isAuthenticated: false,
      isHydrated: false,

      setHydrated: () => set({ isHydrated: true }),

      register: (email, username, password) => {
        const users = getStoredUsers();
        const emailLower = email.toLowerCase().trim();
        if (users.find((u) => u.email === emailLower)) {
          return "This email is already registered. Please login instead.";
        }
        const newUser: RegisteredUser = {
          email: emailLower,
          username,
          passwordHash: password,
        };
        saveUsers([...users, newUser]);
        set({
          token: `token-${emailLower}-${Date.now()}`,
          email: emailLower,
          username,
          isAuthenticated: true,
        });
        return null;
      },

      login: (email, password) => {
        const users = getStoredUsers();
        const emailLower = email.toLowerCase().trim();
        const user = users.find((u) => u.email === emailLower);
        if (!user) {
          return "No account found with this email. Please sign up first.";
        }
        if (user.passwordHash !== password) {
          return "Incorrect password. Please try again.";
        }
        set({
          token: `token-${emailLower}-${Date.now()}`,
          email: emailLower,
          username: user.username,
          isAuthenticated: true,
        });
        return null;
      },

      logout: () =>
        set({
          token: null,
          email: null,
          username: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "sf_auth_session",
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
      },
    }
  )
);