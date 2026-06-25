import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount — try to restore session from backend
  useEffect(() => {
    apiFetch("/auth/me")
      .then((d) => setUser(d.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(async ({ name, email, password, phone }) => {
    const d = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password, phone },
    });
    setUser(d.data.user);
    return d.data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const d = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(d.data.user);
    return d.data.user;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const d = await apiFetch("/users/profile", { method: "PUT", body: data });
    setUser(d.data.user);
    return d.data.user;
  }, []);

  const updateAddress = useCallback(async (data) => {
    return apiFetch("/users/address", { method: "PUT", body: data });
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      await apiFetch("/auth/refresh", { method: "POST" });
      const d = await apiFetch("/auth/me");
      setUser(d.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        updateAddress,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
