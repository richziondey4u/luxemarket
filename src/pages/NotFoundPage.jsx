import { Link } from "react-router-dom";
import { ArrowRight, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "32px 16px",
        backgroundColor: "#fff",
      }}
    >
      <svg
        viewBox="0 0 360 260"
        style={{ width: "100%", maxWidth: "320px", marginBottom: "28px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="180" cy="245" rx="100" ry="9" fill="#f0f0f0" />
        <rect
          x="95"
          y="105"
          width="170"
          height="135"
          rx="14"
          fill="#ffffff"
          stroke="#ebebeb"
          strokeWidth="2"
        />
        <path
          d="M130 105 C130 72 154 60 180 60 C206 60 230 72 230 105"
          fill="none"
          stroke="#4f7d52"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <rect x="95" y="132" width="170" height="2.5" fill="#f3f3f3" />
        <text
          x="180"
          y="192"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="64"
          fontFamily="Georgia, serif"
          fontWeight="700"
          fill="#4f7d52"
          opacity="0.85"
        >
          ?
        </text>
        <circle cx="70" cy="88" r="5" fill="#fbbf24" opacity="0.7" />
        <circle cx="290" cy="78" r="4" fill="#4f7d52" opacity="0.5" />
        <circle cx="60" cy="170" r="3" fill="#4f7d52" opacity="0.35" />
        <circle cx="300" cy="165" r="5" fill="#fbbf24" opacity="0.5" />
        <circle cx="88" cy="220" r="3.5" fill="#f43f5e" opacity="0.4" />
        <circle cx="278" cy="225" r="2.5" fill="#4f7d52" opacity="0.35" />
      </svg>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "#f4f7f4",
          border: "1px solid #a3c4a5",
          borderRadius: "99px",
          padding: "4px 14px",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: "700",
            letterSpacing: "0.08em",
            color: "#4f7d52",
          }}
        >
          ERROR 404
        </span>
      </div>

      <h1
        style={{
          fontFamily: "Playfair Display, Georgia, serif",
          fontSize: "clamp(1.6rem, 5vw, 2.25rem)",
          fontWeight: "700",
          color: "#141414",
          marginBottom: "10px",
        }}
      >
        Oops! Page not found
      </h1>
      <p
        style={{
          color: "#757575",
          maxWidth: "340px",
          margin: "0 auto 28px",
          fontSize: "0.9rem",
          lineHeight: "1.7",
        }}
      >
        Looks like this page went shopping and never came back. Let's get you
        back to finding great products!
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <Link to="/" className="btn-primary" style={{ borderRadius: "8px" }}>
          <Home style={{ width: "15px", height: "15px" }} /> Back to Home
        </Link>
        <Link
          to="/category/smartphones"
          className="btn-secondary"
          style={{ borderRadius: "8px" }}
        >
          <Search style={{ width: "15px", height: "15px" }} /> Browse Products
        </Link>
      </div>

      <p
        style={{ fontSize: "0.78rem", color: "#c8c8c8", marginBottom: "10px" }}
      >
        Quick links
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          justifyContent: "center",
        }}
      >
        {[
          { label: "Electronics", to: "/category/smartphones" },
          { label: "Fashion", to: "/category/tops" },
          { label: "Home & Decor", to: "/category/home-decoration" },
          { label: "My Cart", to: "/cart" },
        ].map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              fontSize: "0.78rem",
              color: "#4f7d52",
              border: "1px solid #a3c4a5",
              borderRadius: "99px",
              padding: "4px 12px",
              backgroundColor: "#f4f7f4",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4f7d52";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f4f7f4";
              e.currentTarget.style.color = "#4f7d52";
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
