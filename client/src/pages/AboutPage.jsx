import { Link } from "react-router-dom";
import { Users, Award, Truck, Shield, Heart, Star } from "lucide-react";

const STATS = [
  { value: "120K+", label: "Happy Customers" },
  { value: "50K+", label: "Products" },
  { value: "99.2%", label: "Satisfaction" },
  { value: "24/7", label: "Support" },
];

const TEAM = [
  {
    name: "Adaeze Okafor",
    role: "CEO & Founder",
    avatar: "AO",
    color: "#4f7d52",
  },
  {
    name: "Emeka Nwosu",
    role: "Head of Operations",
    avatar: "EN",
    color: "#3b82f6",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Product Director",
    avatar: "FA",
    color: "#8b5cf6",
  },
  { name: "Chukwudi Eze", role: "Tech Lead", avatar: "CE", color: "#f59e0b" },
];

const VALUES = [
  {
    icon: <Award style={{ width: "22px", height: "22px" }} />,
    title: "Quality First",
    desc: "Every product is vetted and quality-checked before listing.",
  },
  {
    icon: <Shield style={{ width: "22px", height: "22px" }} />,
    title: "Secure & Safe",
    desc: "Your data and payments are fully encrypted and protected.",
  },
  {
    icon: <Truck style={{ width: "22px", height: "22px" }} />,
    title: "Fast Delivery",
    desc: "We partner with top logistics providers for quick delivery.",
  },
  {
    icon: <Heart style={{ width: "22px", height: "22px" }} />,
    title: "Customer Obsessed",
    desc: "Our entire team is focused on making you happy.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--bg-page)", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          backgroundColor: "var(--bg-section)",
          borderBottom: "1px solid var(--border-light)",
          padding: "clamp(48px, 8vw, 96px) 16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, opacity: 0.4 }}
          className="hero-pattern"
        />
        <div
          style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              backgroundColor: "var(--brand-light)",
              border: "1px solid var(--brand-mid)",
              borderRadius: "99px",
              padding: "5px 14px",
              marginBottom: "20px",
            }}
          >
            <Users
              style={{ width: "13px", height: "13px", color: "var(--brand)" }}
            />
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--brand)",
                letterSpacing: "0.08em",
              }}
            >
              ABOUT US
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: "700",
              color: "var(--text-primary)",
              lineHeight: "1.15",
              marginBottom: "16px",
            }}
          >
            Nigeria's Most Trusted
            <br />
            <span style={{ color: "var(--brand)" }}>Online Marketplace</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: "1.75",
              marginBottom: "28px",
            }}
          >
            LuxeMarket was founded with a simple mission: bring premium products
            to every Nigerian doorstep at fair prices, with world-class service.
          </p>
          <Link
            to="/contact"
            className="btn-primary"
            style={{ borderRadius: "8px" }}
          >
            Get in Touch
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderBottom: "1px solid var(--border-light)" }}>
        <div
          style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 16px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
              gap: "0",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 16px",
                  textAlign: "center",
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid var(--border-light)"
                      : "none",
                }}
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                    fontWeight: "700",
                    color: "var(--brand)",
                    marginBottom: "4px",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 16px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--brand)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "10px",
              }}
            >
              Our Story
            </p>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: "700",
                color: "var(--text-primary)",
                marginBottom: "16px",
              }}
            >
              Built for Nigerians, by Nigerians
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: "1.8",
                marginBottom: "14px",
              }}
            >
              Started in 2022 in Lagos, LuxeMarket grew from a small team of 4
              passionate entrepreneurs who were frustrated with the poor online
              shopping experience in Nigeria.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: "1.8",
                marginBottom: "14px",
              }}
            >
              We built the platform we always wished existed — fast, reliable,
              with genuine products at honest prices and delivery that actually
              shows up on time.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: "1.8",
              }}
            >
              Today we serve over 120,000 customers across all 36 states, with a
              team of 200+ passionate people and thousands of verified sellers.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[
              { year: "2022", event: "Founded in Lagos" },
              { year: "2023", event: "50K customers milestone" },
              { year: "2024", event: "Expanded to all 36 states" },
              { year: "2025", event: "120K+ happy customers" },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "var(--brand)",
                    fontFamily: "Georgia, serif",
                    marginBottom: "4px",
                  }}
                >
                  {item.year}
                </p>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.4",
                  }}
                >
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          backgroundColor: "var(--bg-section)",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          padding: "56px 16px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                color: "var(--brand)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
              }}
            >
              What We Stand For
            </p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "16px",
            }}
          >
            {VALUES.map((v, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "14px",
                  padding: "24px",
                  boxShadow: "var(--shadow-card)",
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "var(--brand-light)",
                    border: "1px solid var(--brand-mid)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--brand)",
                    marginBottom: "14px",
                  }}
                >
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    lineHeight: "1.65",
                  }}
                >
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 16px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "var(--brand)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            The People
          </p>
          <h2 className="section-title">Meet Our Team</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
            gap: "16px",
          }}
        >
          {TEAM.map((member, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "24px",
                textAlign: "center",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  backgroundColor: member.color + "20",
                  border: "2px solid " + member.color + "40",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 14px",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: member.color,
                }}
              >
                {member.avatar}
              </div>
              <p
                style={{
                  fontWeight: "700",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  marginBottom: "4px",
                }}
              >
                {member.name}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          backgroundColor: "var(--bg-section)",
          borderTop: "1px solid var(--border-light)",
          padding: "48px 16px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.4rem, 3vw, 1.875rem)",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            Ready to start shopping?
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              marginBottom: "24px",
            }}
          >
            Join over 120,000 customers who trust LuxeMarket for their daily
            shopping needs.
          </p>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/"
              className="btn-primary"
              style={{ borderRadius: "8px" }}
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="btn-secondary"
              style={{ borderRadius: "8px" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
