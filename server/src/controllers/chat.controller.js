import { prisma } from "../lib/prisma.js";

function formatPrice(n) {
  return `₦${Number(n || 0).toLocaleString("en-NG")}`;
}

// Matches something like #cmrm3hoyc000211s0pyqaynxh or ORD-ABC123XY in free text
function extractOrderNumber(text) {
  const match = text.match(/#?([a-z0-9]{8,})/i);
  return match ? match[1] : null;
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

export async function chat(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ success: false, message: "Message is required." });
    }

    const text = message.toLowerCase().trim();
    const user = req.user || null;

    // 1. Order tracking - works for guests and logged-in users
    const possibleOrderNumber = extractOrderNumber(message);
    if (possibleOrderNumber && (text.includes("order") || text.includes("track") || text.includes("#"))) {
      const order = await prisma.order.findUnique({
        where: { orderNumber: possibleOrderNumber },
        include: { items: true },
      });

      if (order) {
        return res.json({
          success: true,
          reply: `📦 Order **${order.orderNumber}** is currently **${order.status}**.\n\nTotal: ${formatPrice(order.total)} · ${order.items.length} item(s)\n\nWant more detail? Visit [Track Order](/track-order) and enter your order number.`,
        });
      }

      return res.json({
        success: true,
        reply: `I couldn't find an order matching "${possibleOrderNumber}". 🔍\n\nDouble check the order number from your confirmation email, or visit [Track Order](/track-order) to search directly.`,
      });
    }

    // 2. "What's in my cart" (requires login)
    if (includesAny(text, ["my cart", "in my cart", "cart total", "what's in cart"])) {
      if (!user) {
        return res.json({
          success: true,
          reply: `You'll need to be logged in for me to check your cart. 🔐\n\n[Login to My Account](/login) or view your session cart on the [Cart page](/cart).`,
        });
      }

      const cartItems = await prisma.cartItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      if (cartItems.length === 0) {
        return res.json({
          success: true,
          reply: `🛒 Your cart is currently empty. [Start Shopping](/) to find something you'll love!`,
        });
      }

      const total = cartItems.reduce(
        (sum, i) => sum + i.product.price * i.quantity,
        0,
      );
      const lines = cartItems
        .map((i) => `• ${i.product.title} ×${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`)
        .join("\n");

      return res.json({
        success: true,
        reply: `🛒 You have ${cartItems.length} item(s) in your cart:\n\n${lines}\n\n**Total: ${formatPrice(total)}**\n\n[View Cart](/cart) to checkout.`,
      });
    }

    // 3. "What did I order" / recent orders (requires login)
    if (includesAny(text, ["my order", "recent order", "my recent", "order history"])) {
      if (!user) {
        return res.json({
          success: true,
          reply: `You'll need to be logged in for me to check your orders. 🔐\n\n[Login to My Account](/login), or if you have your order number, just ask me to track it directly.`,
        });
      }

      const orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      if (orders.length === 0) {
        return res.json({
          success: true,
          reply: `You don't have any orders yet. [Start Shopping](/) to place your first one!`,
        });
      }

      const lines = orders
        .map((o) => `• Order ${o.orderNumber} — **${o.status}** — ${formatPrice(o.total)}`)
        .join("\n");

      return res.json({
        success: true,
        reply: `Here are your recent orders:\n\n${lines}\n\n[View All Orders](/account/orders) for full details.`,
      });
    }

    // 4. Wishlist (requires login)
    if (includesAny(text, ["my wishlist", "what did i save", "saved item"])) {
      if (!user) {
        return res.json({
          success: true,
          reply: `You'll need to be logged in to check your wishlist. 🔐\n\n[Login to My Account](/login).`,
        });
      }

      const wishlist = await prisma.wishlistItem.findMany({
        where: { userId: user.id },
        include: { product: true },
      });

      if (wishlist.length === 0) {
        return res.json({
          success: true,
          reply: `❤️ Your wishlist is empty right now. [Browse Products](/) and tap the heart icon to save your favorites!`,
        });
      }

      const lines = wishlist.map((w) => `❤️ ${w.product.title}`).join("\n");

      return res.json({
        success: true,
        reply: `You currently have:\n\n${lines}\n\n[View Wishlist](/wishlist)`,
      });
    }

    // 5. Product search by keyword + optional price ceiling
    if (includesAny(text, ["show me", "do you have", "looking for", "search for"]) ||
        /\b(phone|laptop|shoe|watch|bag|dress|shirt|tv|speaker|headphone)/i.test(text)) {
      const priceMatch = text.match(/under\s*₦?([\d,]+)/i);
      const priceCeiling = priceMatch
        ? Number(priceMatch[1].replace(/,/g, ""))
        : null;

      const stopwords = ["show", "me", "do", "you", "have", "looking", "for", "search",
        "under", "a", "an", "the", "please", "some", "any"];
      const keywords = text
        .replace(/₦?[\d,]+/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopwords.includes(w));

      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          ...(priceCeiling ? { price: { lte: priceCeiling } } : {}),
          ...(keywords.length > 0
            ? {
                OR: keywords.map((k) => ({
                  title: { contains: k, mode: "insensitive" },
                })),
              }
            : {}),
        },
        include: { category: true },
        take: 5,
      });

      if (products.length === 0) {
        return res.json({
          success: true,
          reply: `I couldn't find anything matching that. 🔍\n\nTry browsing our [Flash Sale](/flash-sale) or [New Arrivals](/new-arrivals) instead!`,
        });
      }

      const lines = products
        .map(
          (p) =>
            `📦 **${p.title}** — ${formatPrice(p.price)}\n[View Product](/product/${p.id})`,
        )
        .join("\n\n");

      return res.json({
        success: true,
        reply: `Here's what I found:\n\n${lines}`,
      });
    }

    // 6. Static policy/info answers
    if (includesAny(text, ["delivery", "shipping"])) {
      return res.json({
        success: true,
        reply: `🚚 Delivery takes 2–5 days in Lagos and 3–7 days for other states.\n\nFree shipping on orders over ₦80,000! Express delivery (1–2 days) is available in Lagos and Abuja.`,
      });
    }

    if (includesAny(text, ["return", "refund"])) {
      return res.json({
        success: true,
        reply: `↩️ We have a **30-day hassle-free return policy**.\n\nItems must be unused and in original packaging. Refunds are processed within 3–5 business days. Visit [Contact Us](/contact) for help.`,
      });
    }

    if (includesAny(text, ["payment", "pay", "paystack"])) {
      return res.json({
        success: true,
        reply: `💳 We accept cards, bank transfer, USSD, and mobile money via **Paystack**.\n\nPay on delivery is available in Lagos for orders under ₦50,000.`,
      });
    }

    if (includesAny(text, ["track", "order status"])) {
      return res.json({
        success: true,
        reply: `📦 You can track your order on the [Track Order](/track-order) page.\n\nJust enter your order number (from your confirmation email) and you'll see the latest status. You can also just tell me your order number directly!`,
      });
    }

    if (includesAny(text, ["sale", "deal", "discount", "flash"])) {
      return res.json({
        success: true,
        reply: `⚡ Check out our [Flash Sale](/flash-sale) for up to 70% off!\n\nWe also have [New Arrivals](/new-arrivals) updated weekly. 🛍️`,
      });
    }

    if (includesAny(text, ["contact", "support", "help", "human", "agent"])) {
      return res.json({
        success: true,
        reply: `Our support team is available Mon–Fri, 8am–6pm.\n\n📞 +234 803 983 0412\n📧 richzion@luxemarket.com\n\nOr visit our [Contact Page](/contact).`,
      });
    }

    if (includesAny(text, ["hi", "hello", "hey", "good morning", "good afternoon"])) {
      return res.json({
        success: true,
        reply: `Hi there! 👋 I'm LuxeBot. I can help you find products, track orders, check your cart, or answer questions about delivery, returns, and payment.\n\nWhat can I help you with?`,
      });
    }

    // 7. Fallback
    return res.json({
      success: true,
      reply: `I'm not quite sure how to help with that. 😊 Here's what I can do:\n\n• Search products ("show me phones under ₦200,000")\n• Track an order (just paste your order number)\n• Check your cart or recent orders\n• Answer questions about delivery, returns, and payment\n\nOr visit our [FAQ](/faq) or [Contact Support](/contact).`,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res
      .status(500)
      .json({ success: false, message: err.message || "Chat failed" });
  }
}