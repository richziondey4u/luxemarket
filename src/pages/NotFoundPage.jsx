import { Link } from "react-router-dom";
import { ArrowRight, Home, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* Illustration */}
      <div className="relative mb-10 animate-fade-up">
        <svg
          viewBox="0 0 400 300"
          className="w-full max-w-sm mx-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="200" cy="270" rx="120" ry="12" fill="#e5e5e1" />

          {/* Shopping bag body */}
          <rect
            x="110"
            y="120"
            width="180"
            height="145"
            rx="16"
            fill="#ffffff"
            stroke="#e5e5e1"
            strokeWidth="2"
          />

          {/* Bag handle left */}
          <path
            d="M148 120 C148 80 172 68 200 68 C228 68 252 80 252 120"
            fill="none"
            stroke="#4a7c4a"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Bag stripe */}
          <rect x="110" y="148" width="180" height="3" fill="#f5f5f3" />

          {/* Big question mark on bag */}
          <text
            x="200"
            y="210"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="72"
            fontFamily="Georgia, serif"
            fontWeight="700"
            fill="#4a7c4a"
            opacity="0.9"
          >
            ?
          </text>

          {/* Small floating stars / sparkles */}
          <circle cx="85" cy="100" r="5" fill="#fbbf24" opacity="0.7" />
          <circle cx="315" cy="90" r="4" fill="#4a7c4a" opacity="0.5" />
          <circle cx="75" cy="185" r="3" fill="#4a7c4a" opacity="0.4" />
          <circle cx="325" cy="180" r="6" fill="#fbbf24" opacity="0.5" />
          <circle cx="100" cy="240" r="4" fill="#fb7185" opacity="0.5" />
          <circle cx="305" cy="245" r="3" fill="#4a7c4a" opacity="0.4" />

          {/* Search icon floating above */}
          <circle cx="200" cy="38" r="22" fill="#4a7c4a" opacity="0.1" />
          <circle
            cx="200"
            cy="38"
            r="16"
            fill="none"
            stroke="#4a7c4a"
            strokeWidth="3"
          />
          <line
            x1="212"
            y1="50"
            x2="220"
            y2="58"
            stroke="#4a7c4a"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Dotted path lines */}
          <path
            d="M60 155 Q80 130 100 155 Q120 180 140 155"
            fill="none"
            stroke="#4a7c4a"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <path
            d="M260 155 Q280 130 300 155 Q320 180 340 155"
            fill="none"
            stroke="#4a7c4a"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        </svg>

        {/* 404 badge */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <span
            style={{
              background: "linear-gradient(135deg, #4a7c4a, #3d6b3d)",
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
              padding: "0.3rem 1rem",
              borderRadius: "99px",
            }}
          >
            ERROR 404
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
            fontWeight: "700",
            color: "var(--color-neutral-900)",
            marginBottom: "0.75rem",
          }}
        >
          Oops! Page not found
        </h1>
        <p
          style={{
            color: "var(--color-neutral-500)",
            maxWidth: "360px",
            margin: "0 auto 2rem",
            fontSize: "0.95rem",
            lineHeight: "1.7",
          }}
        >
          Looks like this page went shopping and never came back. Let's get you
          back to finding great products!
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap gap-3 justify-center animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <Link to="/" className="btn-primary gap-2 px-6 py-3 rounded-xl">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/category/smartphones"
          className="btn-secondary gap-2 px-6 py-3 rounded-xl"
        >
          <Search className="w-4 h-4" />
          Browse Products
        </Link>
      </div>

      {/* Quick links */}
      <div className="mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--color-neutral-400)",
            marginBottom: "0.75rem",
          }}
        >
          Popular pages
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
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
                fontSize: "0.8rem",
                color: "var(--color-brand-600)",
                border: "1px solid var(--color-brand-200)",
                borderRadius: "99px",
                padding: "0.3rem 0.9rem",
                backgroundColor: "var(--color-brand-50)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--color-brand-500)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-brand-50)";
                e.currentTarget.style.color = "var(--color-brand-600)";
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
