import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
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
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength =
    form.password.length >= 10
      ? 4
      : form.password.length >= 8
        ? 3
        : form.password.length >= 6
          ? 2
          : form.password.length > 0
            ? 1
            : 0;
  const strengthColors = [
    "#e0e0e0",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#4f7d52",
  ];
  const strengthLabels = ["", "Too short", "Weak", "Good", "Strong"];

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
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            padding: "clamp(24px, 5vw, 36px)",
            border: "1px solid #ebebeb",
            boxShadow: "0 4px 24px rgb(0 0 0 / 0.07)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
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
              Create account
            </h1>
            <p style={{ color: "#757575", fontSize: "0.875rem" }}>
              Join thousands of happy shoppers
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {["Free shipping", "Easy returns", "Secure pay"].map((b) => (
              <div
                key={b}
                style={{
                  backgroundColor: "#f4f7f4",
                  border: "1px solid #a3c4a5",
                  borderRadius: "8px",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#4f7d52",
                    fontWeight: "600",
                  }}
                >
                  {b}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "14px",
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
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Name */}
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
                Full Name <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <User
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
                  type="text"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Jane Doe"
                  required
                  className="input-field"
                  style={{ paddingLeft: "38px", fontSize: "0.875rem" }}
                />
              </div>
            </div>
            {/* Email */}
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
                Email <span style={{ color: "#ef4444" }}>*</span>
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
            {/* Phone */}
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
                Phone (optional)
              </label>
              <div style={{ position: "relative" }}>
                <Phone
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
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+234 800 000 0000"
                  className="input-field"
                  style={{ paddingLeft: "38px", fontSize: "0.875rem" }}
                />
              </div>
            </div>
            {/* Passwords */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
                gap: "12px",
              }}
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
                  Password <span style={{ color: "#ef4444" }}>*</span>
                </label>
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
                    placeholder="Min 6 chars"
                    required
                    className="input-field"
                    style={{
                      paddingLeft: "38px",
                      paddingRight: "38px",
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
                  Confirm <span style={{ color: "#ef4444" }}>*</span>
                </label>
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
                    value={form.confirm}
                    onChange={set("confirm")}
                    placeholder="Repeat"
                    required
                    className="input-field"
                    style={{
                      paddingLeft: "38px",
                      fontSize: "0.875rem",
                      borderColor:
                        form.confirm && form.confirm !== form.password
                          ? "#fecdd3"
                          : undefined,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Strength */}
            {form.password && (
              <div>
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: "3px",
                        flex: 1,
                        borderRadius: "99px",
                        backgroundColor:
                          i <= strength ? strengthColors[strength] : "#e0e0e0",
                        transition: "background-color 0.2s",
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: "0.72rem", color: "#757575" }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                required
                style={{
                  width: "14px",
                  height: "14px",
                  marginTop: "2px",
                  accentColor: "#4f7d52",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#757575",
                  lineHeight: "1.5",
                }}
              >
                I agree to the{" "}
                <a href="#" style={{ color: "#4f7d52" }}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" style={{ color: "#4f7d52" }}>
                  Privacy Policy
                </a>
              </span>
            </label>

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
                  Create Account{" "}
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
              marginTop: "18px",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              state={location.state}
              style={{
                color: "#4f7d52",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
        <p style={{ textAlign: "center", marginTop: "14px" }}>
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
