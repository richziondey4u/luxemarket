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
  Package,
  Zap,
  Sparkles,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatPrice } from "../../api/products.js";
import { Link } from "react-router-dom";

/* ── Quick reply suggestions ── */
const QUICK_REPLIES = [
  { label: "🛒 View my cart", msg: "What items are in my cart?" },
  {
    label: "⚡ Flash sale deals",
    msg: "Tell me about the current flash sale deals",
  },
  { label: "✨ New arrivals", msg: "What are your newest products?" },
  { label: "🚚 Delivery info", msg: "How long does delivery take?" },
  { label: "↩️ Return policy", msg: "What is your return policy?" },
  { label: "💳 Payment methods", msg: "What payment methods do you accept?" },
  { label: "📦 Track my order", msg: "How do I track my order?" },
  { label: "📱 Electronics deals", msg: "Show me the best electronics deals" },
];

/* ── System prompt for the AI ── */
const buildSystemPrompt = ({ cartItems, user, cartTotal, cartCount }) => `
You are LuxeBot, a friendly and knowledgeable AI shopping assistant for LuxeMarket — Nigeria's premier online marketplace.

STORE INFO:
- Name: LuxeMarket
- Location: Lagos, Nigeria (delivers nationwide)
- Phone: +234 803 983 0412
- Email: richzion@luxemarket.com
- Currency: Nigerian Naira (₦). Prices are converted from USD at ₦1,600 per $1.

CATEGORIES AVAILABLE:
📱 Smartphones, 💻 Laptops, 🌸 Fragrances, ✨ Skincare, 🛒 Groceries,
🏠 Home & Decor, 🪑 Furniture, 👕 Fashion/Tops, 👗 Women's Dresses,
👠 Women's Shoes, 👔 Men's Shirts, 👟 Men's Shoes, ⌚ Watches,
👜 Bags, 💍 Jewellery, 🕶️ Sunglasses, ⚽ Sports, 🚗 Automotive,
🏍️ Motorcycles, 💡 Lighting, 📲 Tablets

PAGES & LINKS (mention these when relevant):
- Home: /
- Flash Sale (up to 70% off): /flash-sale
- New Arrivals: /new-arrivals
- Cart: /cart
- Track Order: /track-order
- My Account: /account
- Contact/Support: /contact
- FAQ: /faq

POLICIES:
- Free shipping on orders over ₦50,000
- 30-day hassle-free returns
- Secure payment via Paystack (card, bank transfer, USSD)
- Pay on delivery available in Lagos for orders under ₦50,000
- Delivery: 2–5 days (Lagos), 3–7 days (other states)
- Express delivery (1–2 days) available in Lagos and Abuja

CURRENT CUSTOMER:
${user ? `- Logged in as: ${user.name} (${user.email})` : "- Not logged in (guest)"}

CURRENT CART:
${
  cartCount > 0
    ? `- ${cartCount} item(s) in cart\n- Cart total: ${cartTotal}\n- Items: ${cartItems.map((i) => `${i.product.title} x${i.quantity} (${formatPrice(i.product.price * i.quantity)})`).join(", ")}`
    : "- Cart is empty"
}

INSTRUCTIONS:
- Be warm, helpful, and conversational — like a knowledgeable Nigerian shop assistant
- Keep responses concise (2–4 sentences max usually) unless a detailed answer is needed
- Use emojis naturally to match the store's friendly tone
- When recommending products, suggest specific categories with their page links
- If asked about specific product prices, note that prices are in Naira
- Never make up order tracking info — direct users to /track-order
- If the user seems frustrated, be empathetic and offer to connect with human support at /contact
- Occasionally use light Nigerian phrases naturally (e.g., "No wahala!", "E be like say...") but don't overdo it
- Format responses with line breaks for readability when listing multiple things
- Always end with a helpful follow-up question or suggestion when appropriate
`;

/* ── Message bubble component ── */
function MessageBubble({ msg, isLast }) {
  const isBot = msg.role === "assistant";

  // Parse links like [text](/path) in bot messages
  const renderContent = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const before = text.slice(lastIndex, match.index);
        before.split("\n").forEach((line, i, arr) => {
          if (line)
            parts.push(<span key={`t-${match.index}-${i}`}>{line}</span>);
          if (i < arr.length - 1)
            parts.push(<br key={`br-${match.index}-${i}`} />);
        });
      }
      parts.push(
        <Link
          key={match.index}
          to={match[2]}
          style={{
            color: isBot ? "var(--brand)" : "rgba(255,255,255,0.9)",
            fontWeight: "600",
            textDecoration: "underline",
          }}
        >
          {match[1]}
        </Link>,
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      text
        .slice(lastIndex)
        .split("\n")
        .forEach((line, i) => {
          if (line) parts.push(<span key={`end-${i}`}>{line}</span>);
          if (i < text.slice(lastIndex).split("\n").length - 1)
            parts.push(<br key={`endbr-${i}`} />);
        });
    }

    return parts;
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "flex-end",
        flexDirection: isBot ? "row" : "row-reverse",
        marginBottom: "12px",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          flexShrink: 0,
          backgroundColor: isBot ? "var(--brand)" : "var(--border-medium)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2px",
        }}
      >
        {isBot ? (
          <Bot style={{ width: "14px", height: "14px", color: "#fff" }} />
        ) : (
          <User
            style={{
              width: "14px",
              height: "14px",
              color: "var(--text-muted)",
            }}
          />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: "78%",
          backgroundColor: isBot ? "var(--bg-card)" : "var(--brand)",
          color: isBot ? "var(--text-primary)" : "#ffffff",
          padding: "10px 13px",
          borderRadius: isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
          fontSize: "0.84rem",
          lineHeight: "1.6",
          border: isBot ? "1px solid var(--border-light)" : "none",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        {msg.content === "..." ? (
          /* Typing indicator */
          <div
            style={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
              padding: "2px 4px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--text-subtle)",
                  animation: "bounce 1.2s infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        ) : (
          renderContent(msg.content)
        )}
      </div>
    </div>
  );
}

/* ── Main ChatBot component ── */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hey there! 👋 I'm LuxeBot, your personal shopping assistant.\n\nI can help you find products, check deals, answer questions about orders, delivery, and more!\n\nWhat can I help you with today? 😊`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasOpened, setHasOpened] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);

  const {
    items: cartItems,
    totalItems: cartCount,
    total: cartTotal,
  } = useCart();
  const { user } = useAuth();

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  // Show unread badge after 4s if not opened
  useEffect(() => {
    if (hasOpened) return;
    const t = setTimeout(() => {
      if (!open) setUnread(1);
    }, 4000);
    return () => clearTimeout(t);
  }, [open, hasOpened]);

  const sendMessage = useCallback(
    async (text) => {
      const content = text || input.trim();
      if (!content || loading) return;
      setInput("");

      const userMsg = { role: "user", content };
      const typingMsg = { role: "assistant", content: "..." };

      setMessages((prev) => [...prev, userMsg, typingMsg]);
      setLoading(true);

      try {
        const history = messages
          .filter((m) => m.content !== "...")
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: buildSystemPrompt({
              cartItems,
              user,
              cartTotal: formatPrice(cartTotal),
              cartCount,
            }),
            messages: [...history, userMsg],
          }),
        });

        const data = await response.json();
        const reply =
          data.content?.[0]?.text ||
          "Sorry, I couldn't process that. Please try again!";

        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove typing indicator
          { role: "assistant", content: reply },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          {
            role: "assistant",
            content:
              "Hmm, I'm having trouble connecting right now. Please try again in a moment, or contact our support team at [/contact](/contact) 🙏",
          },
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
    setHasOpened(true);
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
  };

  return (
    <>
      {/* ── Bounce animation ── */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes chatPop {
          0%   { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);    opacity: 0.6; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        .chat-window {
          animation: chatPop 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
      `}</style>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "min(380px, calc(100vw - 32px))",
            height: minimized ? "60px" : "min(560px, calc(100vh - 140px))",
            backgroundColor: "var(--bg-page)",
            border: "1px solid var(--border-light)",
            borderRadius: "20px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
            transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--brand), var(--brand-dark))",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {/* Bot avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.4)",
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
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  color: "#fff",
                  margin: 0,
                }}
              >
                LuxeBot
              </p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#4ade80",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  Online · AI Shopping Assistant
                </span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <button
                onClick={resetChat}
                title="Reset chat"
                style={{
                  padding: "5px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                }
              >
                <RotateCcw style={{ width: "14px", height: "14px" }} />
              </button>
              <button
                onClick={() => setMinimized((m) => !m)}
                title={minimized ? "Expand" : "Minimize"}
                style={{
                  padding: "5px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                }
              >
                {minimized ? (
                  <Maximize2 style={{ width: "14px", height: "14px" }} />
                ) : (
                  <Minimize2 style={{ width: "14px", height: "14px" }} />
                )}
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                style={{
                  padding: "5px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.7)")
                }
              >
                <X style={{ width: "15px", height: "15px" }} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages area */}
              <div
                ref={messagesRef}
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 14px 8px",
                  display: "flex",
                  flexDirection: "column",
                  scrollbarWidth: "thin",
                }}
              >
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={i}
                    msg={msg}
                    isLast={i === messages.length - 1}
                  />
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {messages.length <= 2 && (
                <div style={{ padding: "0 14px 10px", overflowX: "auto" }}>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      color: "var(--text-subtle)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "7px",
                      fontWeight: "700",
                    }}
                  >
                    Quick questions
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}
                  >
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr.label}
                        onClick={() => sendMessage(qr.msg)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "99px",
                          fontSize: "0.72rem",
                          fontWeight: "500",
                          backgroundColor: "var(--bg-muted)",
                          border: "1px solid var(--border-light)",
                          color: "var(--text-secondary)",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--brand-light)";
                          e.currentTarget.style.borderColor =
                            "var(--brand-mid)";
                          e.currentTarget.style.color = "var(--brand)";
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

              {/* Cart summary shortcut */}
              {cartCount > 0 && (
                <div
                  style={{
                    margin: "0 14px 10px",
                    padding: "9px 12px",
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
                      gap: "7px",
                    }}
                  >
                    <ShoppingCart
                      style={{
                        width: "14px",
                        height: "14px",
                        color: "var(--brand)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--brand)",
                        fontWeight: "600",
                      }}
                    >
                      {cartCount} item{cartCount !== 1 ? "s" : ""} in cart ·{" "}
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <Link
                    to="/cart"
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--brand)",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    View →
                  </Link>
                </div>
              )}

              {/* Input area */}
              <div
                style={{
                  padding: "10px 14px 14px",
                  borderTop: "1px solid var(--border-light)",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-end",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    rows={1}
                    disabled={loading}
                    style={{
                      flex: 1,
                      resize: "none",
                      border: "1.5px solid var(--border-medium)",
                      borderRadius: "12px",
                      padding: "9px 12px",
                      fontSize: "0.85rem",
                      lineHeight: "1.4",
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-primary)",
                      outline: "none",
                      transition: "border-color 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                      maxHeight: "100px",
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
                        Math.min(e.currentTarget.scrollHeight, 100) + "px";
                    }}
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    style={{
                      width: "38px",
                      height: "38px",
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
                  >
                    <Send style={{ width: "16px", height: "16px" }} />
                  </button>
                </div>
                <p
                  style={{
                    fontSize: "0.62rem",
                    color: "var(--text-subtle)",
                    textAlign: "center",
                    marginTop: "7px",
                  }}
                >
                  Powered by Luxemarket AI · Press Enter to send
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating toggle button ── */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        {/* Pulse ring when there's an unread */}
        {unread > 0 && !open && (
          <div
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "50%",
              border: "2px solid var(--brand)",
              animation: "pulse-ring 1.5s cubic-bezier(0.4,0,0.6,1) infinite",
              pointerEvents: "none",
            }}
          />
        )}

        <button
          onClick={open ? () => setOpen(false) : handleOpen}
          title={open ? "Close chat" : "Chat with LuxeBot"}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "var(--brand)",
            border: "3px solid rgba(255,255,255,0.25)",
            boxShadow:
              "0 4px 20px rgba(79,125,82,0.4), 0 1px 4px rgba(0,0,0,0.15)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 28px rgba(79,125,82,0.55)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(79,125,82,0.4)";
          }}
        >
          {open ? (
            <ChevronDown style={{ width: "22px", height: "22px" }} />
          ) : (
            <MessageCircle
              style={{
                width: "24px",
                height: "24px",
                fill: "rgba(255,255,255,0.15)",
              }}
            />
          )}

          {/* Unread badge */}
          {unread > 0 && !open && (
            <span
              style={{
                position: "absolute",
                top: "-3px",
                right: "-3px",
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

        {/* Tooltip on first visit */}
        {!hasOpened && !open && (
          <div
            style={{
              position: "absolute",
              bottom: "66px",
              right: 0,
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "12px",
              padding: "10px 14px",
              width: "180px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              fontSize: "0.78rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5",
              textAlign: "center",
              animation: "chatPop 0.3s ease forwards",
            }}
          >
            <Bot
              style={{
                width: "18px",
                height: "18px",
                color: "var(--brand)",
                display: "block",
                margin: "0 auto 5px",
              }}
            />
            <strong style={{ color: "var(--text-primary)" }}>Need help?</strong>
            <br />
            Chat with LuxeBot — available 24/7!
            <div
              style={{
                position: "absolute",
                bottom: "-7px",
                right: "22px",
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
      </div>
    </>
  );
}
