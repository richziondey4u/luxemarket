import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart }     from '../../context/CartContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { formatPrice, discountedPrice } from '../../api/products.js'
import { cn, truncate } from '../../lib/utils.js'

export default function ProductCard({ product }) {
  const { addItem }              = useCart()
  const { toggle, isWishlisted } = useWishlist()
  const wishlisted = isWishlisted(product.id)
  const finalPrice = discountedPrice(product.price, product.discountPercentage)

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discountPercentage > 0.5 && (
            <span className="badge-sale">-{Math.round(product.discountPercentage)}%</span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="badge-hot">Low Stock</span>
          )}
          {product.rating >= 4.8 && (
            <span className="badge-new">Top Rated</span>
          )}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.id}`}
            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-brand-400 transition-colors shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product) }}
            className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-slate-950 hover:bg-brand-400 transition-colors shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product) }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all',
            wishlisted
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              : 'bg-black/40 text-white/60 border border-white/10 opacity-0 group-hover:opacity-100',
          )}
        >
          <Heart className={cn('w-4 h-4', wishlisted && 'fill-current')} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-medium">
          {product.brand || product.category}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-slate-200 hover:text-brand-400 transition-colors leading-snug mb-2">
            {truncate(product.title, 45)}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={cn('w-3 h-3', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700')} />
            ))}
          </div>
          <span className="text-xs text-slate-500">({product.reviews?.length || 0})</span>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="price-tag text-base">{formatPrice(finalPrice)}</span>
            {product.discountPercentage > 0.5 && (
              <span className="text-xs text-slate-600 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="w-8 h-8 bg-brand-500/15 border border-brand-500/30 rounded-lg flex items-center justify-center text-brand-400 hover:bg-brand-500 hover:text-slate-950 transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}