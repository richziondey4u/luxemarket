import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  ShoppingCart,
  RotateCcw,
  ChevronDown,
  Zap,
  Sparkles,
  Package,
  Truck,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice } from "../../api/products.js";
import { Link } from "react-router-dom";

/* ── Quick reply suggestions ── */
const QUICK_REPLIES = [
  { label: "⚡ Flash sale", msg: "Tell me about the current flash sale deals" },
  { label: "✨ New arrivals", msg: "What are your newest products?" },
  {
    label: "🚚 Delivery info",
    msg: "How long does delivery take to my location?",
  },
  { label: "↩️ Return policy", msg: "What is your return policy?" },
  { label: "💳 Payment methods", msg: "What payment methods do you accept?" },
  { label: "📦 Track order", msg: "How do I track my order?" },
  { label: "📱 Electronics", msg: "Show me the best electronics deals" },
  { label: "👕 Fashion", msg: "What fashion items do you have?" },
];

/* ── Build system prompt with live context ── */
const buildSystemPrompt = ({ cartItems, user, cartTotal, cartCount }) => `
You are LuxeBot, a warm and knowledgeable AI shopping assistant for LuxeMarket — Nigeria's premier online marketplace based in Lagos.

STORE INFORMATION:
- Name: LuxeMarket
- Location: Lagos, Nigeria (delivers to all 36 states)
- Phone: +234 803 983 0412
- Email: richzion@luxemarket.com
- Currency: Nigerian Naira (₦) — USD prices × 1,600

PRODUCT CATEGORIES:
📱 Smartphones | 💻 Laptops | 📲 Tablets | 🌸 Fragrances | ✨ Skincare
🛒 Groceries | 🏠 Home & Decor | 🪑 Furniture | 👕 Men's Tops | 👗 Women's Dresses
👠 Women's Shoes | 👔 Men's Shirts | 👟 Men's Shoes | ⌚ Watches | 👜 Bags
💍 Jewellery | 🕶️ Sunglasses | ⚽ Sports | 🚗 Automotive | 💡 Lighting

STORE PAGES (use these exact paths when directing customers):
- Home: /
- Flash Sale (up to 70% off): /flash-sale
- New Arrivals: /new-arrivals
- All Electronics: /category/smartphones
- Fashion: /category/tops
- Skincare: /category/skincare
- Shopping Cart: /cart
- Track Order: /track-order
- My Account: /account
- Wishlist: /wishlist
- Contact Support: /contact
- FAQ Page: /faq

STORE POLICIES:
- FREE shipping on orders over ₦50,000
- 30-day hassle-free returns (unused, original packaging)
- Secure payment via Paystack (card, bank transfer, USSD, mobile money)
- Pay on delivery available in Lagos (orders under ₦50,000)
- Standard delivery: 2–5 days Lagos, 3–7 days other states
- Express delivery (1–2 days): Lagos and Abuja only

CURRENT CUSTOMER SESSION:
${user ? `Logged in: ${user.name} (${user.email})` : "Guest (not logged in)"}

CURRENT CART:
${
  cartCount > 0
    ? `${cartCount} item(s) — Total: ${cartTotal}\nItems: ${cartItems.map((i) => `${i.product?.title} ×${i.quantity} = ${formatPrice((i.product?.price || 0) * i.quantity)}`).join(" | ")}`
    : "Cart is empty"
}

RESPONSE RULES:
1. Be warm, concise, and genuinely helpful — like a knowledgeable Lagos shop assistant
2. Keep responses SHORT — 1 to 3 sentences unless a list is truly needed
3. Use emojis naturally but sparingly
4. When mentioning pages, format links as markdown: [Page Name](/path)
5. Never invent tracking info or order details — send them to [Track Order](/track-order)
6. If frustrated customer: empathize and direct to [Contact Support](/contact)
7. Greet by name if the customer is logged in
8. DO NOT repeat the same opening phrase every message
9. DO NOT say "Great question!" or similar filler phrases
10. End with a helpful follow-up only when it adds value
`;

/* ── Render text with markdown links ── */
function RenderText({ text, isBot }) {
  if (!text || text === "...") return null;

  // Split on markdown links [text](url)
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

  return (
    <>
      {parts.map((part, i) => {
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <Link
              key={i}
              to={linkMatch[2]}
              style={{
                color: isBot ? "var(--brand)" : "rgba(255,255,255,0.95)",
                fontWeight: "700",
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textUnderlineOffset: "2px",
              }}
            >
              {linkMatch[1]}
            </Link>
          );
        }
        // Render line breaks
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
}

/* ── Typing dots ── */
function TypingDots() {
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
        padding: "3px 2px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "var(--text-subtle)",
            animation: "lm-bounce 1.2s ease infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Single message bubble ── */
function Bubble({ msg }) {
  const isBot = msg.role === "assistant";
  const isTyping = msg.content === "...";

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        flexDirection: isBot ? "row" : "row-reverse",
        marginBottom: "10px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          flexShrink: 0,
          background: isBot
            ? "linear-gradient(135deg, var(--brand), var(--brand-dark))"
            : "var(--border-medium)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2px",
          boxShadow: isBot ? "0 2px 6px rgba(79,125,82,0.3)" : "none",
        }}
      >
        {isBot ? (
          <Bot style={{ width: "13px", height: "13px", color: "#fff" }} />
        ) : (
          <User
            style={{
              width: "13px",
              height: "13px",
              color: "var(--text-muted)",
            }}
          />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "80%",
          backgroundColor: isBot ? "var(--bg-card)" : "var(--brand)",
          color: isBot ? "var(--text-primary)" : "#ffffff",
          padding: isTyping ? "10px 14px" : "9px 13px",
          borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          fontSize: "0.84rem",
          lineHeight: "1.65",
          border: isBot ? "1px solid var(--border-light)" : "none",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          wordBreak: "break-word",
        }}
      >
        {isTyping ? (
          <TypingDots />
        ) : (
          <RenderText text={msg.content} isBot={isBot} />
        )}
      </div>
    </div>
  );
}

/* ── Main ChatBot ── */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi there! 👋 I'm **LuxeBot**, your personal shopping assistant at LuxeMarket.\n\nI can help you find products, check deals, answer questions about delivery, returns, and more. What can I help you with?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [firstVisit, setFirstVisit] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const {
    items: cartItems = [],
    totalItems: cartCount = 0,
    total: cartTotal = 0,
  } = useCart();
  const { user } = useAuth();

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, minimized]);

  // Show unread badge after 5s
  useEffect(() => {
    if (firstVisit && !open) {
      const t = setTimeout(() => setUnread(1), 5000);
      return () => clearTimeout(t);
    }
  }, [firstVisit, open]);

  /* ── Core send function ── */
  const sendMessage = useCallback(
    async (overrideText) => {
      const text = (overrideText ?? input).trim();
      if (!text || loading) return;
      if (!overrideText) setInput("");

      // Add user message + typing indicator
      const userMsg = { role: "user", content: text };
      const typingMsg = { role: "assistant", content: "..." };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setLoading(true);

      try {
        // Build conversation history (exclude typing indicators)
        const history = messages
          .filter((m) => m.content !== "...")
          .map((m) => ({ role: m.role, content: m.content }));

        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 600,
            system: buildSystemPrompt({
              cartItems,
              user,
              cartTotal: formatPrice(cartTotal),
              cartCount,
            }),
            messages: [...history, userMsg],
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const reply = data?.content?.[0]?.text?.trim();

        if (!reply) throw new Error("Empty response");

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: reply },
        ]);
      } catch (err) {
        console.error("LuxeBot error:", err);

        // Friendly fallback — answer common questions locally
        const lower = text.toLowerCase();
        let fallback = "";

        if (lower.includes("delivery") || lower.includes("shipping")) {
          fallback = `🚚 Delivery takes 2–5 days in Lagos and 3–7 days for other states.\n\nFree shipping on orders over ₦50,000! Express delivery (1–2 days) is available in Lagos and Abuja.`;
        } else if (lower.includes("return") || lower.includes("refund")) {
          fallback = `↩️ We have a **30-day hassle-free return policy**.\n\nItems must be unused and in original packaging. Refunds are processed within 3–5 business days. Visit [Contact Us](/contact) for help.`;
        } else if (lower.includes("payment") || lower.includes("pay")) {
          fallback = `💳 We accept cards, bank transfer, USSD, and mobile money via **Paystack**.\n\nPay on delivery is available in Lagos for orders under ₦50,000.`;
        } else if (lower.includes("track") || lower.includes("order")) {
          fallback = `📦 You can track your order on the [Track Order](/track-order) page.\n\nJust enter your Order ID (from your confirmation email) and you'll see the latest status.`;
        } else if (lower.includes("cart")) {
          fallback =
            cartCount > 0
              ? `🛒 You have ${cartCount} item(s) in your cart totalling ${formatPrice(cartTotal)}. [View Cart](/cart)`
              : `🛒 Your cart is currently empty. [Start Shopping](/)!`;
        } else if (
          lower.includes("sale") ||
          lower.includes("deal") ||
          lower.includes("discount")
        ) {
          fallback = `⚡ Check out our [Flash Sale](/flash-sale) for up to 70% off!\n\nWe also have [New Arrivals](/new-arrivals) updated weekly. 🛍️`;
        } else if (
          lower.includes("contact") ||
          lower.includes("support") ||
          lower.includes("help")
        ) {
          fallback = `Our support team is available Mon–Fri, 8am–6pm.\n\n📞 +234 803 983 0412\n📧 richzion@luxemarket.com\n\nOr visit our [Contact Page](/contact).`;
        } else {
          fallback = `I'm having a brief connection issue, but I'm here to help! 😊\n\nYou can browse our [Flash Sale](/flash-sale), check [New Arrivals](/new-arrivals), or visit our [FAQ](/faq) for common questions.\n\nFor urgent help: [Contact Support](/contact) or call +234 803 983 0412.`;
        }

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: fallback },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, cartItems, user, cartTotal, cartCount],
  );

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
    setFirstVisit(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat reset! 👋 How can I help you today?`,
      },
    ]);
    setInput("");
  };

  const visibleMessages = messages.filter((_, i) => {
    // Always show all messages
    return true;
  });

  return (
    <>
      <style>{`
        @keyframes lm-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
        @keyframes lm-pop {
          0%   { opacity: 0; transform: scale(0.85) translateY(8px); }
          100% { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        @keyframes lm-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(1.7); opacity: 0;   }
        }
        @keyframes lm-tooltip {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0);   }
        }
        .lm-window {
          animation: lm-pop 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .lm-messages::-webkit-scrollbar       { width: 4px; }
        .lm-messages::-webkit-scrollbar-track { background: transparent; }
        .lm-messages::-webkit-scrollbar-thumb { background: var(--border-medium); border-radius: 4px; }
      `}</style>

      {/* ══ Chat Window ══ */}
      {open && (
        <div
          className="lm-window"
          style={{
            position: "fixed",
            bottom: "88px",
            right: "20px",
            width: "min(370px, calc(100vw - 28px))",
            height: minimized ? "62px" : "min(540px, calc(100vh - 130px))",
            backgroundColor: "var(--bg-page)",
            border: "1px solid var(--border-light)",
            borderRadius: "20px",
            boxShadow:
              "0 24px 64px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
            transition: "height 0.28s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              userSelect: "none",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.18)",
                border: "2px solid rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Bot style={{ width: "18px", height: "18px", color: "#fff" }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.88rem",
                  fontWeight: "700",
                  color: "#fff",
                  fontFamily: "Georgia, serif",
                }}
              >
                LuxeBot
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "1px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#4ade80",
                    animation: "lm-ring 2s ease infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {loading ? "Typing..." : "Online · AI Shopping Assistant"}
                </span>
              </div>
            </div>

            {/* Header actions */}
            {[
              {
                icon: <RotateCcw style={{ width: "13px", height: "13px" }} />,
                action: resetChat,
                title: "Reset chat",
              },
              {
                icon: minimized ? (
                  <Maximize2 style={{ width: "13px", height: "13px" }} />
                ) : (
                  <Minimize2 style={{ width: "13px", height: "13px" }} />
                ),
                action: () => setMinimized((m) => !m),
                title: minimized ? "Expand" : "Minimize",
              },
              {
                icon: <X style={{ width: "14px", height: "14px" }} />,
                action: () => setOpen(false),
                title: "Close",
              },
            ].map(({ icon, action, title }) => (
              <button
                key={title}
                onClick={action}
                title={title}
                style={{
                  padding: "5px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.65)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s, background-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {icon}
              </button>
            ))}
          </div>

          {!minimized && (
            <>
              {/* ── Messages ── */}
              <div
                className="lm-messages"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "14px 12px 6px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Date stamp */}
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-subtle)",
                      backgroundColor: "var(--bg-muted)",
                      padding: "2px 10px",
                      borderRadius: "99px",
                      fontWeight: "500",
                    }}
                  >
                    Today
                  </span>
                </div>

                {visibleMessages.map((msg, i) => (
                  <Bubble key={i} msg={msg} />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* ── Quick replies (show on first open) ── */}
              {messages.length <= 2 && (
                <div style={{ padding: "4px 12px 8px" }}>
                  <p
                    style={{
                      fontSize: "0.64rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: "6px",
                      fontWeight: "700",
                    }}
                  >
                    Common questions
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.label}
                        onClick={() => sendMessage(qr.msg)}
                        disabled={loading}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "99px",
                          fontSize: "0.7rem",
                          fontWeight: "500",
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border-light)",
                          color: "var(--text-secondary)",
                          cursor: loading ? "not-allowed" : "pointer",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          if (!loading) {
                            e.currentTarget.style.backgroundColor =
                              "var(--brand-light)";
                            e.currentTarget.style.borderColor =
                              "var(--brand-mid)";
                            e.currentTarget.style.color = "var(--brand)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--bg-muted)";
                          e.currentTarget.style.borderColor =
                            "var(--border-light)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }}
                      >
                        {qr.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Cart strip ── */}
              {cartCount > 0 && (
                <div
                  style={{
                    margin: "0 12px 8px",
                    padding: "8px 12px",
                    backgroundColor: "var(--brand-light)",
                    border: "1px solid var(--brand-mid)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ShoppingCart
                      style={{
                        width: "13px",
                        height: "13px",
                        color: "var(--brand)",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.73rem",
                        color: "var(--brand)",
                        fontWeight: "600",
                      }}
                    >
                      {cartCount} item{cartCount !== 1 ? "s" : ""} ·{" "}
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--brand)",
                      fontWeight: "700",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    View Cart →
                  </Link>
                </div>
              )}

              {/* ── Input ── */}
              <div
                style={{
                  padding: "8px 12px 12px",
                  borderTop: "1px solid var(--border-light)",
                  flexShrink: 0,
                  backgroundColor: "var(--bg-page)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "7px",
                    alignItems: "flex-end",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      loading ? "LuxeBot is typing..." : "Ask me anything..."
                    }
                    rows={1}
                    disabled={loading}
                    style={{
                      flex: 1,
                      resize: "none",
                      border: "1.5px solid var(--border-medium)",
                      borderRadius: "12px",
                      padding: "9px 12px",
                      fontSize: "0.84rem",
                      lineHeight: "1.4",
                      backgroundColor: loading
                        ? "var(--bg-muted)"
                        : "var(--bg-input)",
                      color: "var(--text-primary)",
                      outline: "none",
                      transition: "border-color 0.2s, background-color 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                      maxHeight: "90px",
                      overflowY: "auto",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--brand)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--border-medium)")
                    }
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height =
                        Math.min(e.currentTarget.scrollHeight, 90) + "px";
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      flexShrink: 0,
                      backgroundColor:
                        input.trim() && !loading
                          ? "var(--brand)"
                          : "var(--bg-muted)",
                      border: "none",
                      cursor:
                        input.trim() && !loading ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      color:
                        input.trim() && !loading
                          ? "#fff"
                          : "var(--text-subtle)",
                    }}
                    onMouseEnter={(e) => {
                      if (input.trim() && !loading)
                        e.currentTarget.style.backgroundColor =
                          "var(--brand-dark)";
                    }}
                    onMouseLeave={(e) => {
                      if (input.trim() && !loading)
                        e.currentTarget.style.backgroundColor = "var(--brand)";
                    }}
                  >
                    <Send style={{ width: "15px", height: "15px" }} />
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "0.6rem",
                    color: "var(--text-subtle)",
                    textAlign: "center",
                    marginTop: "6px",
                  }}
                >
                  Powered by Luxemarket AI · Enter to send · Shift+Enter for new
                  line
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ══ Float Button ══ */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        {/* Pulse ring */}
        {unread > 0 && !open && (
          <div
            style={{
              position: "absolute",
              inset: "-6px",
              borderRadius: "50%",
              border: "2px solid var(--brand)",
              opacity: 0.7,
              animation: "lm-ring 1.6s ease-out infinite",
              pointerEvents: "none",
            }}
          />
        )}

        {/* Tooltip — shows before first open */}
        {firstVisit && !open && unread > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "68px",
              right: 0,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "14px",
              padding: "11px 14px",
              width: "190px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5",
              textAlign: "center",
              animation: "lm-tooltip 0.3s ease forwards",
            }}
          >
            <Bot
              style={{
                width: "20px",
                height: "20px",
                color: "var(--brand)",
                display: "block",
                margin: "0 auto 6px",
              }}
            />
            <strong
              style={{ color: "var(--text-primary)", fontSize: "0.82rem" }}
            >
              LuxeBot is here!
            </strong>
            <br />
            <span style={{ fontSize: "0.74rem" }}>
              Need help? I'm available 24/7 🛍️
            </span>
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                bottom: "-7px",
                right: "20px",
                width: "12px",
                height: "12px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderTop: "none",
                borderLeft: "none",
                transform: "rotate(45deg)",
              }}
            />
          </div>
        )}

        {/* Main button */}
        <button
          onClick={open ? () => setOpen(false) : handleOpen}
          title={open ? "Close chat" : "Chat with LuxeBot"}
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            background: open
              ? "var(--bg-card)"
              : "linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%)",
            border: open
              ? "2px solid var(--border-medium)"
              : "3px solid rgba(255,255,255,0.3)",
            boxShadow: open
              ? "0 2px 12px rgba(0,0,0,0.1)"
              : "0 6px 24px rgba(79,125,82,0.45), 0 2px 8px rgba(0,0,0,0.12)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: open ? "var(--text-secondary)" : "#fff",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) translateY(-1px)";
            e.currentTarget.style.boxShadow = open
              ? "0 4px 16px rgba(0,0,0,0.14)"
              : "0 8px 32px rgba(79,125,82,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = open
              ? "0 2px 12px rgba(0,0,0,0.1)"
              : "0 6px 24px rgba(79,125,82,0.45)";
          }}
        >
          {open ? (
            <ChevronDown style={{ width: "20px", height: "20px" }} />
          ) : (
            <MessageCircle
              style={{
                width: "23px",
                height: "23px",
                fill: "rgba(255,255,255,0.2)",
              }}
            />
          )}

          {/* Unread dot */}
          {unread > 0 && !open && (
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                border: "2px solid var(--bg-page)",
                fontSize: "9px",
                fontWeight: "800",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              1
            </span>
          )}
        </button>
      </div>
    </>
  );
}
