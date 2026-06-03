import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { CATEGORIES } from "../../api/products.js";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f7f7f7",
        borderTop: "1px solid #ebebeb",
        paddingTop: "64px",
        paddingBottom: "32px",
        marginTop: "80px",
      }}
    >
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "#4f7d52",
                  borderRadius: "8px",
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
                    fontSize: "15px",
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
                  fontSize: "1.1rem",
                }}
              >
                Luxe<span style={{ color: "#4f7d52" }}>Market</span>
              </span>
            </Link>
            <p
              style={{
                color: "#757575",
                fontSize: "0.875rem",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              Premium shopping experience with curated products. Quality
              guaranteed, delivered to your door.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#757575",
                    transition: "all 0.2s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.color = "#4f7d52";
                    e.currentTarget.style.backgroundColor = "#f4f7f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.color = "#757575";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  <Icon style={{ width: "15px", height: "15px" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "16px",
                fontSize: "0.95rem",
              }}
            >
              Categories
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {CATEGORIES.slice(0, 7).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "0.85rem",
                      color: "#757575",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#4f7d52")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#757575")
                    }
                  >
                    <span>{cat.icon}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "16px",
                fontSize: "0.95rem",
              }}
            >
              Account
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {[
                { to: "/login", label: "Login" },
                { to: "/register", label: "Create Account" },
                { to: "/account", label: "My Orders" },
                { to: "/cart", label: "Shopping Cart" },
                { to: "/account", label: "Wishlist" },
              ].map((l) => (
                <li key={l.to + l.label}>
                  <Link
                    to={l.to}
                    style={{
                      fontSize: "0.85rem",
                      color: "#757575",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#4f7d52")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#757575")
                    }
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontFamily: "Georgia, serif",
                fontWeight: "700",
                color: "#141414",
                marginBottom: "16px",
                fontSize: "0.95rem",
              }}
            >
              Contact Us
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                {
                  icon: (
                    <MapPin
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "#4f7d52",
                        flexShrink: 0,
                      }}
                    />
                  ),
                  text: "001  Richzion Drive, Lagos, Nigeria",
                },
                {
                  icon: (
                    <Phone
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "#4f7d52",
                        flexShrink: 0,
                      }}
                    />
                  ),
                  text: "+2348039830412",
                },
                {
                  icon: (
                    <Mail
                      style={{
                        width: "15px",
                        height: "15px",
                        color: "#4f7d52",
                        flexShrink: 0,
                      }}
                    />
                  ),
                  text: "richzion@luxemarket.com",
                },
              ].map((item, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "0.85rem",
                    color: "#757575",
                  }}
                >
                  {item.icon} {item.text}
                </li>
              ))}
            </ul>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#3a3a3a",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Newsletter
            </p>
            <div style={{ display: "flex" }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #e0e0e0",
                  borderRight: "none",
                  color: "#242424",
                  fontSize: "0.85rem",
                  borderRadius: "6px 0 0 6px",
                  padding: "8px 12px",
                  outline: "none",
                }}
              />
              <button
                style={{
                  backgroundColor: "#4f7d52",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  padding: "8px 14px",
                  borderRadius: "0 6px 6px 0",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#3d6440")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#4f7d52")
                }
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "#a0a0a0" }}>
            © {new Date().getFullYear()} LuxeMarket. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Privacy Policy", "Terms", "Refunds"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontSize: "0.8rem",
                  color: "#a0a0a0",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4f7d52")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a0a0a0")}
              >
                {l}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            {["Paystack", "Visa", "Mastercard"].map((p) => (
              <span
                key={p}
                style={{
                  fontSize: "0.72rem",
                  color: "#a0a0a0",
                  backgroundColor: "#ffffff",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "1px solid #e0e0e0",
                  fontFamily: "monospace",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
