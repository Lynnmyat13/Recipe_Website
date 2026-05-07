import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../lib/api";
import * as api from "../lib/api";

const TOKEN_KEY = "recipe_token";
const USER_KEY = "recipe_user";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function normalizeStoredUser(value: string): User {
  const parsed = JSON.parse(value) as Partial<User>;
  return {
    id: String(parsed.id ?? ""),
    email: String(parsed.email ?? ""),
    name: String(parsed.name ?? ""),
    role: parsed.role === "admin" ? "admin" : "user",
    profileImage: parsed.profileImage || "",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStored = useCallback(async () => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        const storedUser = normalizeStoredUser(u);
        setUser(storedUser);

        // Sync with server to get latest profile image/info
        try {
          const freshUser = await api.getCurrentUser();
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        } catch (e) {
          console.error("Failed to sync user session:", e);
          if ((e as any).status === 401) {
            logout();
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const { user: u, token: t } = await api.login(email, password);
    setUser(u);
    setToken(t);
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    return u;
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setError(null);
      const { user: u, token: t } = await api.register(email, password, name);
      setUser(u);
      setToken(t);
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      return u;
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value: AuthContextType = {
    user,
    setUser: (u: User | null) => {
      setUser(u);
      if (u) {
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    },
    token,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
