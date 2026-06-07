import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAdminAuth } from "./context/AdminAuthContext.jsx";

export default function AdminAuth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "admin",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAdminAuth();
  const navigate = useNavigate();
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register") {
      if (form.password !== form.confirm) {
        setError("Passwords do not match");
        return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#f9fafb",
    border: "1.5px solid #e5e7eb",
    color: "#111827",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    fontFamily: "DM Sans, sans-serif",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0fdf4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "400px",
            height: "400px",
            backgroundColor: "rgba(79,125,82,0.08)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "300px",
            height: "300px",
            backgroundColor: "rgba(79,125,82,0.06)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#4f7d52",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 8px 24px rgba(79,125,82,0.3)",
              }}
            >
              <Shield
                style={{ width: "28px", height: "28px", color: "#fff" }}
              />
            </div>
          </Link>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.5rem",
              color: "#111827",
              marginBottom: "4px",
            }}
          >
            {mode === "login" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            {mode === "login"
              ? "LuxeMarket Management Portal"
              : "Set up your admin access"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "clamp(20px, 5vw, 32px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#dc2626",
                fontSize: "0.82rem",
              }}
            >
              <AlertCircle
                style={{ width: "14px", height: "14px", flexShrink: 0 }}
              />{" "}
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {/* Name — register only */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Full Name <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "15px",
                      height: "15px",
                      color: "#9ca3af",
                    }}
                  />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    required
                    placeholder="Jane Doe"
                    style={{ ...inputStyle, paddingLeft: "36px" }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4f7d52";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(79,125,82,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>
            )}

            {/* Role — register only */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={set("role")}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,125,82,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="manager">Manager (Orders & Products)</option>
                  <option value="viewer">Viewer (Read Only)</option>
                </select>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Email Address <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "11px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "15px",
                    height: "15px",
                    color: "#9ca3af",
                  }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  placeholder="admin@luxemarket.com"
                  style={{ ...inputStyle, paddingLeft: "36px" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,125,82,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Password <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "11px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "15px",
                    height: "15px",
                    color: "#9ca3af",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  required
                  placeholder="Min 6 characters"
                  style={{
                    ...inputStyle,
                    paddingLeft: "36px",
                    paddingRight: "40px",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(79,125,82,0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                  }}
                >
                  {showPass ? (
                    <EyeOff style={{ width: "15px", height: "15px" }} />
                  ) : (
                    <Eye style={{ width: "15px", height: "15px" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password — register only */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Confirm Password <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: "11px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "15px",
                      height: "15px",
                      color: "#9ca3af",
                    }}
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.confirm}
                    onChange={set("confirm")}
                    required
                    placeholder="Repeat password"
                    style={{
                      ...inputStyle,
                      paddingLeft: "36px",
                      borderColor:
                        form.confirm && form.confirm !== form.password
                          ? "#ef4444"
                          : "#e5e7eb",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#4f7d52";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(79,125,82,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        form.confirm && form.confirm !== form.password
                          ? "#ef4444"
                          : "#e5e7eb";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
                {form.confirm && form.confirm !== form.password && (
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "#ef4444",
                      marginTop: "4px",
                    }}
                  >
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#4f7d52",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "0.875rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#3d6440";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#4f7d52")
              }
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />{" "}
                  Please wait...
                </>
              ) : (
                <>
                  <Shield style={{ width: "15px", height: "15px" }} />{" "}
                  {mode === "login" ? "Sign In" : "Create Account"}{" "}
                  <ArrowRight style={{ width: "14px", height: "14px" }} />
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.82rem",
              color: "#6b7280",
              marginTop: "20px",
            }}
          >
            {mode === "login"
              ? "Don't have an admin account? "
              : "Already have an account? "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              style={{
                color: "#4f7d52",
                fontWeight: "700",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                textDecoration: "underline",
              }}
            >
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to="/"
            style={{
              fontSize: "0.78rem",
              color: "#9ca3af",
              textDecoration: "none",
            }}
          >
            ← Back to Store
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
