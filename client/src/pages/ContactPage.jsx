import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Headphones,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const CONTACT_METHODS = [
  {
    icon: <Phone style={{ width: "20px", height: "20px" }} />,
    title: "Call Us",
    value: "+234 800 000 0000",
    sub: "Mon–Fri, 8am–6pm WAT",
  },
  {
    icon: <Mail style={{ width: "20px", height: "20px" }} />,
    title: "Email Us",
    value: "hello@luxemarket.com",
    sub: "We reply within 24hrs",
  },
  {
    icon: <MapPin style={{ width: "20px", height: "20px" }} />,
    title: "Visit Us",
    value: "123 Commerce St, Lagos",
    sub: "Victoria Island, Lagos",
  },
  {
    icon: <Clock style={{ width: "20px", height: "20px" }} />,
    title: "Working Hours",
    value: "Mon–Fri: 8am–6pm",
    sub: "Sat: 9am–3pm WAT",
  },
];

const SUPPORT_TOPICS = [
  {
    icon: <Package style={{ width: "18px", height: "18px" }} />,
    label: "Order & Delivery",
  },
  {
    icon: <Headphones style={{ width: "18px", height: "18px" }} />,
    label: "Technical Support",
  },
  {
    icon: <MessageSquare style={{ width: "18px", height: "18px" }} />,
    label: "General Enquiry",
  },
  {
    icon: <Mail style={{ width: "18px", height: "18px" }} />,
    label: "Partnership",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    topic: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm((v) => ({ ...v, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours. 😊");
    setForm({ name: "", email: "", subject: "", topic: "", message: "" });
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: "var(--bg-page)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--bg-section)",
          borderBottom: "1px solid var(--border-light)",
          padding: "clamp(40px, 6vw, 72px) 16px",
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
          style={{ position: "relative", maxWidth: "560px", margin: "0 auto" }}
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
              marginBottom: "16px",
            }}
          >
            <MessageSquare
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
              CONTACT US
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              fontWeight: "700",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            We'd Love to Hear
            <br />
            <span style={{ color: "var(--brand)" }}>From You</span>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              lineHeight: "1.7",
            }}
          >
            Our friendly support team is here to help. Reach out anytime!
          </p>
        </div>
      </div>

      {/* Contact cards */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 16px 0" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "14px",
            marginBottom: "48px",
          }}
        >
          {CONTACT_METHODS.map((m, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "var(--shadow-card)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.borderColor = "var(--brand-mid)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "var(--brand-light)",
                  border: "1px solid var(--brand-mid)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand)",
                  marginBottom: "12px",
                }}
              >
                {m.icon}
              </div>
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "4px",
                }}
              >
                {m.title}
              </p>
              <p
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "2px",
                }}
              >
                {m.value}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "28px",
            marginBottom: "64px",
          }}
        >
          {/* Form */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "16px",
              padding: "clamp(20px, 4vw, 32px)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.25rem",
                color: "var(--text-primary)",
                marginBottom: "20px",
              }}
            >
              Send a Message
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
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
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    Your Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={set("name")}
                    required
                    placeholder="Jane Doe"
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      fontWeight: "600",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    placeholder="you@example.com"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Topic pills */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Topic
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {SUPPORT_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      type="button"
                      onClick={() => setForm((v) => ({ ...v, topic: t.label }))}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 12px",
                        borderRadius: "99px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        border: "1.5px solid",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        backgroundColor:
                          form.topic === t.label
                            ? "var(--brand)"
                            : "var(--bg-page)",
                        borderColor:
                          form.topic === t.label
                            ? "var(--brand)"
                            : "var(--border-medium)",
                        color:
                          form.topic === t.label
                            ? "#fff"
                            : "var(--text-secondary)",
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  Subject *
                </label>
                <input
                  value={form.subject}
                  onChange={set("subject")}
                  required
                  placeholder="How can we help?"
                  className="input-field"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: "600",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={set("message")}
                  required
                  placeholder="Tell us more..."
                  rows={5}
                  className="input-field"
                  style={{ resize: "vertical" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ borderRadius: "8px", justifyContent: "center" }}
              >
                {loading ? (
                  <div
                    style={{
                      width: "17px",
                      height: "17px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                    }}
                    className="animate-spin"
                  />
                ) : (
                  <>
                    <Send style={{ width: "15px", height: "15px" }} /> Send
                    Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map / Additional info */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {/* Embedded-style map placeholder */}
            <div
              style={{
                backgroundColor: "var(--bg-section)",
                border: "1px solid var(--border-light)",
                borderRadius: "16px",
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{ position: "absolute", inset: 0, opacity: 0.5 }}
                className="hero-pattern"
              />
              <div style={{ position: "relative", textAlign: "center" }}>
                <MapPin
                  style={{
                    width: "36px",
                    height: "36px",
                    color: "var(--brand)",
                    margin: "0 auto 10px",
                  }}
                />
                <p
                  style={{
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                  }}
                >
                  LuxeMarket HQ
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  123 Commerce St, Victoria Island
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                  Lagos, Nigeria
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    fontSize: "0.78rem",
                    color: "var(--brand)",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            {/* FAQ shortcut */}
            <div
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                Before you write...
              </h3>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  marginBottom: "14px",
                  lineHeight: "1.6",
                }}
              >
                Your question might already be answered! Check our FAQ for quick
                answers to common questions.
              </p>
              <Link
                to="/faq"
                className="btn-outline"
                style={{
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  padding: "8px 16px",
                }}
              >
                Browse FAQ →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
