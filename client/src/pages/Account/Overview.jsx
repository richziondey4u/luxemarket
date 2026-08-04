import { Link, useOutletContext } from "react-router-dom";
import { Package, Heart, Star, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import OrderCard from "./OrderCard.jsx";

export default function Overview() {
  const { orders } = useOutletContext();
  const { items: wishItems } = useWishlist();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-white">
        Account Overview
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Orders",
            value: orders.length,
            icon: <Package className="w-5 h-5" />,
            color: "text-brand-400",
          },
          {
            label: "Wishlist",
            value: wishItems.length,
            icon: <Heart className="w-5 h-5" />,
            color: "text-rose-400",
          },
          {
            label: "Reviews",
            value: 0,
            icon: <Star className="w-5 h-5" />,
            color: "text-amber-400",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="card-dark rounded-2xl p-5 border border-white/8 text-center"
          >
            <div className={`${s.color} flex justify-center mb-2`}>
              {s.icon}
            </div>
            <p className="text-2xl font-display font-bold text-white">
              {s.value}
            </p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {orders.length > 0 ? (
        <div className="card-dark rounded-2xl p-5 border border-white/8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Latest Order</h3>
            <Link
              to="/account/orders"
              className="text-xs text-brand-400 hover:underline"
            >
              View all
            </Link>
          </div>
          <OrderCard order={orders[0]} defaultExpanded />
        </div>
      ) : (
        <div className="card-dark rounded-2xl p-10 border border-white/8 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No orders yet. Start shopping!</p>
          <Link to="/" className="btn-primary text-sm">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
