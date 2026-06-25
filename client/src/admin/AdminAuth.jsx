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
  Key,
} from "lucide-react";
import {
  useAdminAuth,
  ADMIN_INVITE_CODE,
} from "./context/AdminAuthContext.jsx";

export default function AdminAuth() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "admin",
    inviteCode: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useAdminAuth();
  const navigate = useNavigate();
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!form.inviteCode.trim()) {
        setError("Authorization code is required to create an admin account");
        return;
      }
      if (form.inviteCode.trim().toUpperCase() !== ADMIN_INVITE_CODE) {
        setError("Invalid authorization code. Contact the system owner.");
        return;
      }
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
          inviteCode: form.inviteCode,
        });
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setForm({
      name: "",
      email: "",
      password: "",
      confirm: "",
      role: "admin",
      inviteCode: "",
    });
  };

  /* ── Shared styles ── */
  const inp = {
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
  const focus = (e) => {
    e.currentTarget.style.borderColor = "#4f7d52";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,125,82,0.12)";
  };
  const blur = (e) => {
    e.currentTarget.style.borderColor = "#e5e7eb";
    e.currentTarget.style.boxShadow = "none";
  };
  const lbl = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "360px",
            height: "360px",
            backgroundColor: "rgba(79,125,82,0.08)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "280px",
            height: "280px",
            backgroundColor: "rgba(79,125,82,0.06)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            width: "120px",
            height: "120px",
            backgroundColor: "rgba(79,125,82,0.04)",
            borderRadius: "50%",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#4f7d52",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 14px",
                boxShadow: "0 8px 24px rgba(79,125,82,0.35)",
              }}
            >
              <Shield
                style={{ width: "30px", height: "30px", color: "#fff" }}
              />
            </div>
          </Link>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.6rem",
              color: "#111827",
              marginBottom: "6px",
            }}
          >
            {mode === "login" ? "Admin Sign In" : "Create Admin Account"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#6b7280" }}>
            {mode === "login"
              ? "Sign in to the LuxeMarket admin portal"
              : "You need an authorization code to register"}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "clamp(20px, 5vw, 36px)",
            boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
          }}
        >
          {/* Error */}
          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "11px 14px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "flex-start",
                gap: "9px",
                color: "#dc2626",
                fontSize: "0.82rem",
                lineHeight: "1.5",
              }}
            >
              <AlertCircle
                style={{
                  width: "15px",
                  height: "15px",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {/* ── REGISTER ONLY FIELDS ── */}
            {mode === "register" && (
              <>
                {/* Authorization code — FIRST, most prominent */}
                <div
                  style={{
                    backgroundColor: "#fffbeb",
                    border: "1.5px solid #f59e0b",
                    borderRadius: "10px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      marginBottom: "10px",
                    }}
                  >
                    <Key
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "#d97706",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: "700",
                        color: "#92400e",
                      }}
                    >
                      Authorization Code Required
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "#78350f",
                      marginBottom: "10px",
                      lineHeight: "1.5",
                    }}
                  >
                    Admin accounts require an invite code. Contact the system
                    owner to get one.
                  </p>
                  <div style={{ position: "relative" }}>
                    <Key
                      style={{
                        position: "absolute",
                        left: "11px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "14px",
                        height: "14px",
                        color: "#d97706",
                      }}
                    />
                    <input
                      type={showCode ? "text" : "password"}
                      value={form.inviteCode}
                      onChange={set("inviteCode")}
                      required
                      placeholder="Enter authorization code"
                      style={{
                        ...inp,
                        paddingLeft: "34px",
                        paddingRight: "40px",
                        backgroundColor: "#fff",
                        borderColor: "#f59e0b",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#d97706";
                        e.currentTarget.style.boxShadow =
                          "0 0 0 3px rgba(245,158,11,0.15)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#f59e0b";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode((s) => !s)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#d97706",
                        display: "flex",
                      }}
                    >
                      {showCode ? (
                        <EyeOff style={{ width: "14px", height: "14px" }} />
                      ) : (
                        <Eye style={{ width: "14px", height: "14px" }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label style={lbl}>
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
                      style={{ ...inp, paddingLeft: "36px" }}
                      onFocus={focus}
                      onBlur={blur}
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label style={lbl}>Role</label>
                  <select
                    value={form.role}
                    onChange={set("role")}
                    style={{ ...inp, cursor: "pointer" }}
                    onFocus={focus}
                    onBlur={blur}
                  >
                    <option value="admin">Admin — Full Access</option>
                    <option value="manager">Manager — Orders & Products</option>
                    <option value="viewer">Viewer — Read Only</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label style={lbl}>
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
                  style={{ ...inp, paddingLeft: "36px" }}
                  onFocus={focus}
                  onBlur={blur}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={lbl}>
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
                  style={{ ...inp, paddingLeft: "36px", paddingRight: "40px" }}
                  onFocus={focus}
                  onBlur={blur}
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

            {/* Confirm password */}
            {mode === "register" && (
              <div>
                <label style={lbl}>
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
                      ...inp,
                      paddingLeft: "36px",
                      borderColor:
                        form.confirm && form.confirm !== form.password
                          ? "#ef4444"
                          : "#e5e7eb",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor =
                        form.confirm && form.confirm !== form.password
                          ? "#ef4444"
                          : "#4f7d52";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(79,125,82,0.12)";
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
                borderRadius: "10px",
                padding: "13px",
                fontSize: "0.9rem",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "4px",
                transition: "background-color 0.2s, transform 0.1s",
                boxShadow: "0 4px 14px rgba(79,125,82,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = "#3d6440";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4f7d52";
                e.currentTarget.style.transform = "none";
              }}
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
                  />
                  Please wait...
                </>
              ) : (
                <>
                  <Shield style={{ width: "16px", height: "16px" }} />
                  {mode === "login"
                    ? "Sign In to Admin"
                    : "Create Admin Account"}
                  <ArrowRight style={{ width: "15px", height: "15px" }} />
                </>
              )}
            </button>
          </form>

          {/* Mode toggle */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.82rem",
              color: "#6b7280",
              marginTop: "20px",
              lineHeight: "1.5",
            }}
          >
            {mode === "login"
              ? "Don't have an admin account? "
              : "Already have an admin account? "}
            <button
              onClick={() =>
                switchMode(mode === "login" ? "register" : "login")
              }
              style={{
                color: "#4f7d52",
                fontWeight: "700",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              {mode === "login" ? "Create one" : "Sign in instead"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "14px" }}>
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
