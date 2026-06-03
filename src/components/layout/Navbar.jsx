import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Heart,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Package,
  Home,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { CATEGORIES } from "../../api/products.js";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const h = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setMobileOpen(false);
    setSearchQuery("");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ebebeb",
        boxShadow: scrolled ? "0 2px 12px rgb(0 0 0 / 0.07)" : "none",
        transition: "box-shadow 0.3s",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "60px",
            gap: "8px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              flexShrink: 0,
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
                  fontSize: "16px",
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

          {/* Desktop Nav */}
          <nav
            style={{ display: "none", alignItems: "center", gap: "24px" }}
            className="md-nav"
          >
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                fontSize: "0.875rem",
                fontWeight: "500",
                textDecoration: "none",
                color: isActive ? "#4f7d52" : "#3a3a3a",
                transition: "color 0.2s",
              })}
            >
              Home
            </NavLink>

            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#3a3a3a",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Categories{" "}
                <ChevronDown
                  style={{
                    width: "14px",
                    height: "14px",
                    transform: catOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {catOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingTop: "8px",
                    width: "520px",
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ebebeb",
                      borderRadius: "12px",
                      padding: "12px",
                      boxShadow: "0 8px 32px rgb(0 0 0 / 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        gap: "4px",
                      }}
                    >
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          to={`/category/${cat.slug}`}
                          onClick={() => setCatOpen(false)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            padding: "10px 8px",
                            borderRadius: "8px",
                            textDecoration: "none",
                            textAlign: "center",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f4f7f4")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          <span style={{ fontSize: "1.4rem" }}>{cat.icon}</span>
                          <span
                            style={{
                              fontSize: "0.7rem",
                              color: "#555",
                              fontWeight: "500",
                            }}
                          >
                            {cat.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {[
              { to: "/category/smartphones", label: "Electronics" },
              { to: "/category/tops", label: "Fashion" },
              { to: "/category/home-decoration", label: "Home & Decor" },
            ].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                style={({ isActive }) => ({
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textDecoration: "none",
                  color: isActive ? "#4f7d52" : "#3a3a3a",
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              flexShrink: 0,
            }}
          >
            {/* Search toggle */}
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  style={{
                    width: "140px",
                    backgroundColor: "#f3f3f3",
                    border: "1.5px solid #e0e0e0",
                    borderRight: "none",
                    color: "#242424",
                    fontSize: "0.8rem",
                    borderRadius: "6px 0 0 6px",
                    padding: "7px 10px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#4f7d52",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0 6px 6px 0",
                    padding: "7px 10px",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  <Search style={{ width: "15px", height: "15px" }} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    padding: "7px",
                    color: "#757575",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X style={{ width: "15px", height: "15px" }} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  padding: "8px",
                  color: "#555",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Search style={{ width: "20px", height: "20px" }} />
              </button>
            )}

            {/* Wishlist */}
            <Link
              to="/account"
              style={{
                position: "relative",
                padding: "8px",
                color: "#555",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Heart style={{ width: "20px", height: "20px" }} />
              {wishCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#f43f5e",
                    borderRadius: "50%",
                    fontSize: "9px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              style={{
                position: "relative",
                padding: "8px",
                color: "#555",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ShoppingCart style={{ width: "20px", height: "20px" }} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "17px",
                    height: "17px",
                    backgroundColor: "#4f7d52",
                    borderRadius: "50%",
                    fontSize: "9px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                  }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* User desktop */}
            {isAuthenticated ? (
              <div
                style={{ position: "relative" }}
                className="md-flex"
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#3a3a3a",
                      fontWeight: "500",
                      maxWidth: "60px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    style={{ width: "12px", height: "12px", color: "#a0a0a0" }}
                  />
                </button>
                {userOpen && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      paddingTop: "4px",
                      width: "170px",
                      zIndex: 200,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ebebeb",
                        borderRadius: "10px",
                        padding: "4px 0",
                        boxShadow: "0 8px 24px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      {[
                        {
                          to: "/account",
                          label: "My Account",
                          icon: (
                            <User style={{ width: "13px", height: "13px" }} />
                          ),
                        },
                        {
                          to: "/account",
                          label: "Orders",
                          icon: (
                            <Package
                              style={{ width: "13px", height: "13px" }}
                            />
                          ),
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "9px 14px",
                            fontSize: "0.8rem",
                            color: "#3a3a3a",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f4f7f4")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              "transparent")
                          }
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #ebebeb",
                          margin: "4px 0",
                        }}
                      />
                      <button
                        onClick={logout}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "9px 14px",
                          fontSize: "0.8rem",
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff1f2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <LogOut style={{ width: "13px", height: "13px" }} />{" "}
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="md-flex"
                style={{ alignItems: "center", gap: "6px" }}
              >
                <Link
                  to="/login"
                  style={{
                    fontSize: "0.78rem",
                    color: "#3a3a3a",
                    fontWeight: "500",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1.5px solid #e0e0e0",
                    textDecoration: "none",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ fontSize: "0.75rem", padding: "6px 14px" }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md-hide"
              style={{
                padding: "8px",
                color: "#555",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {mobileOpen ? (
                <X style={{ width: "20px", height: "20px" }} />
              ) : (
                <Menu style={{ width: "20px", height: "20px" }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderTop: "1px solid #ebebeb",
            padding: "12px 16px 20px",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {/* Mobile search */}
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", marginBottom: "12px" }}
          >
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1,
                backgroundColor: "#f3f3f3",
                border: "1.5px solid #e0e0e0",
                borderRight: "none",
                color: "#242424",
                fontSize: "0.875rem",
                borderRadius: "6px 0 0 6px",
                padding: "9px 12px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#4f7d52",
                color: "#fff",
                border: "none",
                borderRadius: "0 6px 6px 0",
                padding: "9px 14px",
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Search style={{ width: "16px", height: "16px" }} />
            </button>
          </form>

          {[
            {
              to: "/",
              label: "Home",
              icon: <Home style={{ width: "16px", height: "16px" }} />,
              end: true,
            },
            {
              to: "/category/smartphones",
              label: "Electronics",
              icon: <span>📱</span>,
            },
            { to: "/category/tops", label: "Fashion", icon: <span>👕</span> },
            {
              to: "/category/home-decoration",
              label: "Home & Decor",
              icon: <span>🏠</span>,
            },
            {
              to: "/category/sports-accessories",
              label: "Sports",
              icon: <span>⚽</span>,
            },
            {
              to: "/category/fragrances",
              label: "Fragrances",
              icon: <span>🌸</span>,
            },
            {
              to: "/cart",
              label: `Cart (${totalItems})`,
              icon: <ShoppingCart style={{ width: "16px", height: "16px" }} />,
            },
          ].map((link) => (
            <NavLink
              key={link.to + link.label}
              to={link.to}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "500",
                textDecoration: "none",
                marginBottom: "2px",
                backgroundColor: isActive ? "#f4f7f4" : "transparent",
                color: isActive ? "#4f7d52" : "#3a3a3a",
              })}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ebebeb",
              margin: "10px 0",
            }}
          />

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 12px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#3a3a3a",
                  textDecoration: "none",
                  marginBottom: "2px",
                }}
              >
                <User style={{ width: "16px", height: "16px" }} /> {user.name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 12px",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  color: "#ef4444",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                <LogOut style={{ width: "16px", height: "16px" }} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary"
                style={{
                  flex: 1,
                  fontSize: "0.82rem",
                  padding: "10px",
                  justifyContent: "center",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{
                  flex: 1,
                  fontSize: "0.82rem",
                  padding: "10px",
                  justifyContent: "center",
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        .md-nav  { display: none !important; }
        .md-flex { display: none !important; }
        .md-hide { display: flex !important; }
        @media (min-width: 768px) {
          .md-nav  { display: flex !important; }
          .md-flex { display: flex !important; }
          .md-hide { display: none !important; }
        }
      `}</style>
    </header>
  );
}
