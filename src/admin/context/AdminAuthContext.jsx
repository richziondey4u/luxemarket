import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const AdminAuthContext = createContext(null);

const ADMINS_KEY = "lm_admins";
const SESSION_KEY = "lm_admin_session";

// ── Change this secret code to whatever you want ──
export const ADMIN_INVITE_CODE = "3020*";

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(SESSION_KEY);
      if (s) setAdmin(JSON.parse(s));
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  const getAdmins = () => {
    try {
      return JSON.parse(localStorage.getItem(ADMINS_KEY) || "[]");
    } catch {
      return [];
    }
  };

  const register = useCallback(
    async ({ name, email, password, role = "admin", inviteCode }) => {
      await new Promise((r) => setTimeout(r, 600));

      // ── Validate invite code ──
      if (
        !inviteCode ||
        inviteCode.trim().toUpperCase() !== ADMIN_INVITE_CODE
      ) {
        throw new Error(
          "Invalid authorization code. Contact the system owner.",
        );
      }

      const admins = getAdmins();
      if (admins.find((a) => a.email === email)) {
        throw new Error("Email already registered as admin");
      }

      const newAdmin = {
        id: "admin_" + Date.now(),
        name,
        email,
        password,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4f7d52&textColor=ffffff`,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(ADMINS_KEY, JSON.stringify([...admins, newAdmin]));
      const { password: _, ...safe } = newAdmin;
      localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
      setAdmin(safe);
      return safe;
    },
    [],
  );

  const login = useCallback(async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 600));
    const found = getAdmins().find(
      (a) => a.email === email && a.password === password,
    );
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...safe } = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    setAdmin(safe);
    return safe;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
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
