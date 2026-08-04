import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Star,
  Share2,
  Check,
  ChevronDown,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatPrice, discountedPrice } from "../api/products.js";
import { truncate } from "../lib/utils.js";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Added" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function categoryLabel(product) {
  return (
    product.brand ||
    (typeof product.category === "object"
      ? product.category?.name
      : product.category) ||
    ""
  );
}

function StarRating({ rating = 0 }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1 mb-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-slate-700"
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] text-slate-500">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  const [selected, setSelected] = useState(new Set());
  const [sortBy, setSortBy] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(new Set());

  const sortedItems = useMemo(() => {
    const list = [...items];
    switch (sortBy) {
      case "price-asc":
        return list.sort(
          (a, b) =>
            discountedPrice(a.price, a.discountPercentage) -
            discountedPrice(b.price, b.discountPercentage),
        );
      case "price-desc":
        return list.sort(
          (a, b) =>
            discountedPrice(b.price, b.discountPercentage) -
            discountedPrice(a.price, a.discountPercentage),
        );
      case "name":
        return list.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return list;
    }
  }, [items, sortBy]);

  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(items.map((p) => p.id)));
  };

  const flashAdded = (id) => {
    setJustAdded((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1500);
  };

  const addSelectedToCart = () => {
    items
      .filter((p) => selected.has(p.id))
      .forEach((p) => {
        addItem(p);
        flashAdded(p.id);
      });
  };

  const removeSelected = () => {
    items.filter((p) => selected.has(p.id)).forEach((p) => toggle(p));
    setSelected(new Set());
  };

  const shareWishlist = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Wishlist", url });
      } catch {
        /* user cancelled share */
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-white/8 px-4 sm:px-6 lg:px-8 py-3.5">
        <p className="text-xs text-slate-500">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>{" "}
          / <span className="text-white font-medium">Wishlist</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              My Wishlist
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={shareWishlist}
              className="btn-secondary text-sm py-2 px-4 gap-2 inline-flex items-center"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share List
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/8 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-9 h-9 text-slate-600" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Save items you love and come back to them anytime.
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Discover Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar: select all, bulk actions, sort */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5 pb-4 border-b border-white/8">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <span
                    className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${
                      allSelected
                        ? "bg-brand-500 border-brand-500"
                        : "border-white/20"
                    }`}
                    style={{ width: 18, height: 18 }}
                  >
                    {allSelected && (
                      <Check className="w-3 h-3 text-slate-950" />
                    )}
                  </span>
                  Select All
                </button>

                {selected.size > 0 && (
                  <>
                    <span className="text-sm text-slate-600">
                      {selected.size} selected
                    </span>
                    <button
                      onClick={addSelectedToCart}
                      className="text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                    <button
                      onClick={removeSelected}
                      className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen((o) => !o)}
                    className="flex items-center gap-2 text-sm text-slate-300 border border-white/10 rounded-lg px-3 py-1.5 hover:border-white/25 transition-colors"
                  >
                    {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 card-dark border border-white/10 rounded-xl overflow-hidden z-10 shadow-lg">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors ${
                            sortBy === opt.value
                              ? "text-brand-400 bg-brand-500/10"
                              : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => items.forEach((p) => addItem(p))}
                  className="btn-primary text-sm py-2 px-4 gap-2 inline-flex items-center"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add All to Cart
                </button>
              </div>
            </div>

            {/* Grid */}
            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedItems.map((product) => {
                const finalPrice = discountedPrice(
                  product.price,
                  product.discountPercentage,
                );
                const isChecked = selected.has(product.id);
                const wasAdded = justAdded.has(product.id);
                const outOfStock = product.stock === 0;

                return (
                  <div
                    key={product.id}
                    className={`card-dark rounded-2xl border overflow-hidden transition-colors ${
                      isChecked
                        ? "border-brand-500/50"
                        : "border-white/8 hover:border-white/15"
                    }`}
                  >
                    {/* Toolbar strip - checkbox + remove, separated from image */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-white/8">
                      <button
                        onClick={() => toggleSelect(product.id)}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className="rounded flex items-center justify-center border transition-colors"
                          style={{
                            width: 16,
                            height: 16,
                            backgroundColor: isChecked
                              ? "var(--brand, #22c55e)"
                              : "transparent",
                            borderColor: isChecked
                              ? "transparent"
                              : "rgba(255,255,255,0.25)",
                          }}
                        >
                          {isChecked && (
                            <Check className="w-2.5 h-2.5 text-slate-950" />
                          )}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Select
                        </span>
                      </button>

                      <button
                        onClick={() => toggle(product)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-square bg-white/5 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className={`w-full h-full object-cover ${outOfStock ? "opacity-40" : ""}`}
                      />

                      {product.discountPercentage > 0.5 && (
                        <span className="badge-sale absolute top-2 left-2">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}

                      {outOfStock && (
                        <span className="absolute inset-x-0 bottom-0 bg-slate-950/85 text-center text-[11px] font-semibold text-red-400 py-1.5">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5">
                      <Link to={`/product/${product.id}`}>
                        <p className="text-sm font-semibold text-white hover:text-brand-400 transition-colors mb-1 leading-snug">
                          {truncate(product.title, 40)}
                        </p>
                      </Link>

                      <p className="text-xs text-slate-500 mb-1.5">
                        {categoryLabel(product)}
                      </p>

                      <StarRating rating={product.rating} />

                      <div className="flex items-baseline gap-1.5 mb-3">
                        <span className="price-tag text-base">
                          {formatPrice(finalPrice)}
                        </span>
                        {product.discountPercentage > 0.5 && (
                          <span className="text-xs text-slate-600 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          addItem(product);
                          flashAdded(product.id);
                        }}
                        disabled={outOfStock}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          outOfStock
                            ? "bg-white/5 text-slate-600 cursor-not-allowed"
                            : wasAdded
                              ? "bg-green-500 text-slate-950"
                              : "bg-brand-500 text-slate-950 hover:bg-brand-400"
                        }`}
                      >
                        {wasAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Added
                          </>
                        ) : outOfStock ? (
                          "Unavailable"
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
