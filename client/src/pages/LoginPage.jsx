import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "clamp(24px, 5vw, 36px)",
            border: "1px solid #ebebeb",
            boxShadow: "0 4px 24px rgb(0 0 0 / 0.07)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#4f7d52",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontFamily: "Georgia, serif",
                    fontWeight: "700",
                    fontSize: "17px",
                  }}
                >
                  L
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Georgia, serif",
                  fontWeight: "700",
                  color: "#141414",
                  fontSize: "1.2rem",
                }}
              >
                Luxe<span style={{ color: "#4f7d52" }}>Market</span>
              </span>
            </Link>
            <h1
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.6rem",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "6px",
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: "#757575", fontSize: "0.875rem" }}>
              Sign in to your account to continue
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#fefce8",
              border: "1px solid #fef08a",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                fontSize: "0.78rem",
                color: "#a16207",
                textAlign: "center",
              }}
            >
              💡 Register first, then login — credentials saved locally
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "0.82rem",
                color: "#be123c",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  color: "#3a3a3a",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "15px",
                    height: "15px",
                    color: "#a0a0a0",
                  }}
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  required
                  className="input-field"
                  style={{ paddingLeft: "38px", fontSize: "0.875rem" }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    color: "#3a3a3a",
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  style={{
                    fontSize: "0.75rem",
                    color: "#4f7d52",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "15px",
                    height: "15px",
                    color: "#a0a0a0",
                  }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                  required
                  className="input-field"
                  style={{
                    paddingLeft: "38px",
                    paddingRight: "40px",
                    fontSize: "0.875rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#a0a0a0",
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
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                borderRadius: "8px",
                fontSize: "0.875rem",
                padding: "12px",
                justifyContent: "center",
                marginTop: "4px",
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : (
                <>
                  Sign In{" "}
                  <ArrowRight style={{ width: "16px", height: "16px" }} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "0.82rem",
              color: "#757575",
              marginTop: "20px",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              state={location.state}
              style={{
                color: "#4f7d52",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Create one free
            </Link>
          </p>
        </div>
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          <Link
            to="/"
            style={{
              fontSize: "0.82rem",
              color: "#a0a0a0",
              textDecoration: "none",
            }}
          >
            ← Back to store
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
