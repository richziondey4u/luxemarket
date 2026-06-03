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
import { cn } from "../../lib/utils.js";

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

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const navbarStyle = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #ebebeb",
    boxShadow: scrolled ? "0 2px 12px rgb(0 0 0 / 0.06)" : "none",
    transition: "box-shadow 0.3s",
  };

  const linkCls = ({ isActive }) =>
    cn(
      "text-sm font-medium transition-colors",
      isActive ? "text-[#4f7d52]" : "text-[#3a3a3a] hover:text-[#4f7d52]",
    );

  return (
    <header style={navbarStyle}>
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
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
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                backgroundColor: "#4f7d52",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
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
                letterSpacing: "-0.01em",
              }}
            >
              Luxe<span style={{ color: "#4f7d52" }}>Market</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}
            className="hidden md:flex"
          >
            <NavLink to="/" className={linkCls} end>
              Home
            </NavLink>

            {/* Categories mega dropdown */}
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
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4f7d52")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#3a3a3a")}
              >
                Categories
                <ChevronDown
                  style={{
                    width: "14px",
                    height: "14px",
                    transition: "transform 0.2s",
                    transform: catOpen ? "rotate(180deg)" : "rotate(0)",
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
                    width: "560px",
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #ebebeb",
                      borderRadius: "12px",
                      padding: "1rem",
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
                            transition: "background-color 0.2s",
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
                              fontSize: "0.72rem",
                              color: "#555555",
                              fontWeight: "500",
                              lineHeight: "1.2",
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

            <NavLink to="/category/smartphones" className={linkCls}>
              Electronics
            </NavLink>
            <NavLink to="/category/tops" className={linkCls}>
              Fashion
            </NavLink>
            <NavLink to="/category/home-decoration" className={linkCls}>
              Home
            </NavLink>
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Search */}
            {searchOpen ? (
              <form
                onSubmit={handleSearch}
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  style={{
                    width: "200px",
                    backgroundColor: "#f3f3f3",
                    border: "1.5px solid #e0e0e0",
                    borderRight: "none",
                    color: "#242424",
                    fontSize: "0.875rem",
                    borderRadius: "6px 0 0 6px",
                    padding: "8px 12px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#4f7d52",
                    color: "#fff",
                    borderRadius: "0 6px 6px 0",
                    padding: "8px 12px",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Search style={{ width: "16px", height: "16px" }} />
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  style={{
                    padding: "8px",
                    color: "#757575",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "2px",
                  }}
                >
                  <X style={{ width: "16px", height: "16px" }} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                style={{
                  padding: "8px",
                  color: "#555555",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "8px",
                  transition: "color 0.2s, background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#4f7d52";
                  e.currentTarget.style.backgroundColor = "#f4f7f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#555555";
                  e.currentTarget.style.backgroundColor = "transparent";
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
                color: "#555555",
                borderRadius: "8px",
                transition: "color 0.2s, background-color 0.2s",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#4f7d52";
                e.currentTarget.style.backgroundColor = "#f4f7f4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#555555";
                e.currentTarget.style.backgroundColor = "transparent";
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
                    fontSize: "10px",
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
                color: "#555555",
                borderRadius: "8px",
                transition: "color 0.2s, background-color 0.2s",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#4f7d52";
                e.currentTarget.style.backgroundColor = "#f4f7f4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#555555";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ShoppingCart style={{ width: "20px", height: "20px" }} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    width: "18px",
                    height: "18px",
                    backgroundColor: "#4f7d52",
                    borderRadius: "50%",
                    fontSize: "10px",
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

            {/* User dropdown */}
            {isAuthenticated ? (
              <div
                style={{ position: "relative" }}
                className="hidden md:block"
                onMouseEnter={() => setUserOpen(true)}
                onMouseLeave={() => setUserOpen(false)}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    background: "none",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.backgroundColor = "#f4f7f4";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#3a3a3a",
                      fontWeight: "500",
                      maxWidth: "70px",
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
                      width: "180px",
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #ebebeb",
                        borderRadius: "10px",
                        padding: "4px 0",
                        boxShadow: "0 8px 24px rgb(0 0 0 / 0.1)",
                      }}
                    >
                      {[
                        {
                          to: "/account",
                          icon: (
                            <User style={{ width: "14px", height: "14px" }} />
                          ),
                          label: "My Account",
                        },
                        {
                          to: "/account",
                          icon: (
                            <Package
                              style={{ width: "14px", height: "14px" }}
                            />
                          ),
                          label: "Orders",
                        },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "10px 14px",
                            fontSize: "0.8rem",
                            color: "#3a3a3a",
                            textDecoration: "none",
                            transition: "background-color 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f4f7f4";
                            e.currentTarget.style.color = "#4f7d52";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = "#3a3a3a";
                          }}
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
                          padding: "10px 14px",
                          fontSize: "0.8rem",
                          color: "#ef4444",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff1f2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <LogOut style={{ width: "14px", height: "14px" }} />{" "}
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="hidden md:flex"
                style={{ alignItems: "center", gap: "8px", marginLeft: "4px" }}
              >
                <Link
                  to="/login"
                  style={{
                    fontSize: "0.8rem",
                    color: "#3a3a3a",
                    fontWeight: "500",
                    padding: "7px 14px",
                    borderRadius: "6px",
                    border: "1.5px solid #e0e0e0",
                    textDecoration: "none",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4f7d52";
                    e.currentTarget.style.color = "#4f7d52";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.color = "#3a3a3a";
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ fontSize: "0.78rem", padding: "7px 16px" }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                padding: "8px",
                color: "#555555",
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
            padding: "12px 16px 16px",
          }}
        >
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
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "0.875rem",
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
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
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
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
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
            <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, fontSize: "0.8rem" }}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="btn-primary"
                style={{ flex: 1, fontSize: "0.8rem" }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
