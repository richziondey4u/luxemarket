import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AdminAuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ADMIN_INVITE_CODE = "LUXE-ADMIN-2025";

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res
    .json()
    .catch(() => ({ success: false, message: "Server error" }));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    apiFetch("/auth/me")
      .then((d) => {
        const user = d.data?.user;
        if (user && ["ADMIN", "MANAGER", "VIEWER"].includes(user.role)) {
          setAdmin(user);
        } else {
          setAdmin(null);
        }
      })
      .catch(() => setAdmin(null))
      .finally(() => setIsLoading(false));
  }, []);

  const register = useCallback(
    async ({ name, email, password, role, inviteCode }) => {
      // Validate invite code on frontend too
      if (
        !inviteCode ||
        inviteCode.trim().toUpperCase() !== ADMIN_INVITE_CODE
      ) {
        throw new Error("Invalid authorization code.");
      }
      // Call backend — saves to PostgreSQL
      const d = await apiFetch("/auth/admin/register", {
        method: "POST",
        body: { name, email, password, role: role || "ADMIN", inviteCode },
      });
      const user = d.data?.user;
      if (!user) throw new Error("Registration failed");
      setAdmin(user);
      return user;
    },
    [],
  );

  const login = useCallback(async ({ email, password }) => {
    const d = await apiFetch("/auth/admin/login", {
      method: "POST",
      body: { email, password },
    });
    const user = d.data?.user;
    if (!user) throw new Error("Login failed");
    setAdmin(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
