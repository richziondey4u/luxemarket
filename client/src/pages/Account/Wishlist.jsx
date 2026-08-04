import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../api/products.js";

export default function Wishlist() {
  const { items: wishItems, toggle } = useWishlist();
  const { addItem } = useCart();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">
        My Wishlist
      </h2>
      {wishItems.length === 0 ? (
        <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
          <Heart className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">Your wishlist is empty.</p>
          <Link to="/" className="btn-primary text-sm">
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {wishItems.map((product) => (
            <div
              key={product.id}
              className="card-dark rounded-2xl p-4 border border-white/8 flex gap-4"
            >
              <Link to={`/product/${product.id}`} className="flex-shrink-0">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-20 h-20 rounded-xl object-cover bg-slate-800"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`}>
                  <p className="text-sm font-medium text-white hover:text-brand-400 transition-colors truncate">
                    {product.title}
                  </p>
                </Link>
                <p className="price-tag text-base mt-1">
                  {formatPrice(product.price)}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => addItem(product)}
                    className="btn-primary text-xs py-1.5 px-3 rounded-lg"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggle(product)}
                    className="text-xs text-red-400 hover:text-red-300 px-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
