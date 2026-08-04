import { prisma } from "../lib/prisma.js"; // adjust to your actual prisma export path

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

function formatPrice(n) {
  return `₦${Number(n || 0).toLocaleString("en-NG")}`;
}

// Matches something like #cmrm3hoyc000211s0pyqaynxh or ORD-ABC123XY in free text
function extractOrderNumber(text) {
  const match = text.match(/#?([a-z0-9]{8,})/i);
  return match ? match[1] : null;
}

async function buildContext(req, userMessage) {
  const user = req.user || null;

  // Featured/active products (cap to keep prompt small)
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    take: 20,
    orderBy: { createdAt: "desc" },
  });

  let cart = { items: [], total: 0 };
  let recentOrders = [];
  let wishlist = [];

  if (user) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    cart.items = cartItems;
    cart.total = cartItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );

    recentOrders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
  }

  // If the user's message looks like it contains an order number, try to
  // look it up directly - works for guests too, since order lookup by
  // number doesn't require ownership (same as your public tracking page).
  let trackedOrder = null;
  const possibleOrderNumber = extractOrderNumber(userMessage);
  if (possibleOrderNumber) {
    trackedOrder = await prisma.order.findUnique({
      where: { orderNumber: possibleOrderNumber },
      include: { items: true },
    });
  }

  return { user, products, cart, recentOrders, wishlist, trackedOrder };
}

function buildSystemPrompt({
  user,
  products,
  cart,
  recentOrders,
  wishlist,
  trackedOrder,
}) {
  return `You are LuxeBot, a friendly AI shopping assistant for LuxeMarket — Nigeria's premier online marketplace.

STORE INFO:
- Location: Lagos, Nigeria (delivers to all 36 states)
- Phone: +234 803 983 0412
- Email: richzion@luxemarket.com
- Currency: Nigerian Naira (₦)

FEATURED PRODUCTS IN STORE RIGHT NOW:
${
  products.length > 0
    ? products
        .map(
          (p) =>
            `• ${p.title} — ${formatPrice(p.price)} (${p.category?.name || "General"}) [/product/${p.id}]`,
        )
        .join("\n")
    : "• Browse our full collection at luxemarket.com"
}

PAGES:
- Flash Sale: /flash-sale
- New Arrivals: /new-arrivals
- Cart: /cart | Track Order: /track-order | FAQ: /faq | Contact: /contact

POLICIES:
- Free shipping on orders over ₦80,000
- 30-day hassle-free returns
- Paystack secure payment (card, bank transfer, USSD, pay-on-delivery Lagos)
- Delivery: 2–5 days Lagos, 3–7 other states

CUSTOMER: ${user ? `${user.name} (${user.email})` : "Guest - not logged in"}

CART: ${
    cart.items.length > 0
      ? `${cart.items.length} item(s) — Total: ${formatPrice(cart.total)}\nItems: ${cart.items.map((i) => `${i.product.title} ×${i.quantity}`).join(", ")}`
      : "Empty"
  }

${
  recentOrders.length > 0
    ? `RECENT ORDERS:\n${recentOrders.map((o) => `• Order ${o.orderNumber} — ${o.status} — ${formatPrice(o.total)}`).join("\n")}`
    : ""
}

${
  wishlist.length > 0
    ? `WISHLIST:\n${wishlist.map((w) => `• ${w.product.title}`).join("\n")}`
    : ""
}

${
  trackedOrder
    ? `TRACKED ORDER LOOKUP (the customer mentioned this order number in their message):\nOrder ${trackedOrder.orderNumber} is currently **${trackedOrder.status}**. Total: ${formatPrice(trackedOrder.total)}, ${trackedOrder.items.length} item(s).`
    : ""
}

RULES:
1. Be warm and helpful — like a knowledgeable Lagos shop assistant
2. Keep responses SHORT (2–3 sentences max) unless listing items
3. Use emojis naturally but sparingly
4. Format links as [Label](/path) - use REAL product links from the list above when relevant
5. If a TRACKED ORDER LOOKUP is present above, answer using that real data - never invent tracking details
6. If asked about an order and no TRACKED ORDER LOOKUP is present, direct to [Track Order](/track-order)
7. Only reference products, prices, and order data actually provided above - never invent products or prices
8. End with one helpful follow-up question when it adds value`;
}

export async function chat(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Message is required." });
    }

    const context = await buildContext(req, message);
    const systemPrompt = buildSystemPrompt(context);

    const apiRes = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: systemPrompt,
        messages: [
          ...history.map((h) => ({ role: h.role, content: h.content })),
          { role: "user", content: message },
        ],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.json().catch(() => ({}));
      throw new Error(
        errBody?.error?.message || `Anthropic API error ${apiRes.status}`,
      );
    }

    const data = await apiRes.json();
    const reply = data?.content?.[0]?.text?.trim();

    if (!reply) throw new Error("Empty response from model");

    res.json({ success: true, reply });
  } catch (err) {
    console.error("Chat error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Chat failed" });
  }
}
