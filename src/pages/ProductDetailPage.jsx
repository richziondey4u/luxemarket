import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronRight, ChevronLeft, Star, ShoppingCart, Heart,
  Shield, Truck, RotateCcw, Share2, Minus, Plus,
} from 'lucide-react'
import { useProduct, useRelatedProducts } from '../hooks/useProducts.js'
import { useCart }     from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { formatPrice, discountedPrice, getCategoryBySlug } from '../api/products.js'
import { cn } from '../lib/utils.js'
import ProductCard from '../components/product/ProductCard.jsx'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { data: product, isLoading, isError } = useProduct(id)
  const { data: related } = useRelatedProducts(product?.category, product?.id)

  const { addItem }              = useCart()
  const { toggle, isWishlisted } = useWishlist()

  const [qty,         setQty]         = useState(1)
  const [selectedImg, setSelectedImg] = useState(0)
  const [activeTab,   setActiveTab]   = useState('description')

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-slate-800 rounded-3xl shimmer-bg" />
        <div className="space-y-4 pt-4">
          {[1/4, 3/4, 1/3, 1, 2/3].map((w, i) => (
            <div key={i} className="h-5 shimmer-bg rounded" style={{ width: `${w * 100}%` }} />
          ))}
        </div>
      </div>
    </div>
  )

  if (isError || !product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="font-display text-2xl font-bold text-white mb-2">Product not found</h2>
      <Link to="/" className="btn-primary mt-4">Back to Home</Link>
    </div>
  )

  const finalPrice = discountedPrice(product.price, product.discountPercentage)
  const savings    = product.price - finalPrice
  const wishlisted = isWishlisted(product.id)
  const images     = product.images?.length ? product.images : [product.thumbnail]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
        <Link to="/" className="text-slate-500 hover:text-brand-400">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <Link to={`/category/${product.category}`} className="text-slate-500 hover:text-brand-400 capitalize">
          {getCategoryBySlug(product.category)?.label || product.category}
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-700" />
        <span className="text-slate-300 truncate max-w-[200px]">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">

        {/* ── Image gallery ── */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-slate-900 rounded-3xl overflow-hidden border border-white/8">
            <img src={images[selectedImg]} alt={product.title} className="w-full h-full object-cover" />
            {product.discountPercentage > 0.5 && (
              <div className="absolute top-4 left-4 badge-sale text-base font-bold px-3 py-1">
                -{Math.round(product.discountPercentage)}% OFF
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImg(i => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-xl flex items-center justify-center text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImg(i => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-xl flex items-center justify-center text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={cn('flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                    selectedImg === i ? 'border-brand-500' : 'border-white/10 hover:border-white/30')}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ── */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-brand-400 uppercase tracking-wider font-medium">
                {product.brand || product.category}
              </span>
              {product.stock > 0
                ? <span className="badge-new text-xs">In Stock ({product.stock})</span>
                : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30">Out of Stock</span>
              }
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {product.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn('w-4 h-4', i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700')} />
                ))}
              </div>
              <span className="text-sm text-slate-400">{product.rating} ({product.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold text-brand-400">{formatPrice(finalPrice)}</span>
            {savings > 0.5 && (
              <>
                <span className="text-lg text-slate-600 line-through mb-1">{formatPrice(product.price)}</span>
                <span className="badge-sale mb-1">Save {formatPrice(savings)}</span>
              </>
            )}
          </div>

          <p className="text-slate-400 leading-relaxed">{product.description}</p>

          {/* Quantity */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-white font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                  className="p-3 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-500">{product.stock} available</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => addItem(product, qty)}
              disabled={product.stock === 0}
              className="flex-1 btn-primary gap-2 py-3.5 rounded-2xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
            <button onClick={() => toggle(product)}
              className={cn('p-3.5 rounded-2xl border transition-all',
                wishlisted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/40')}>
              <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
            </button>
            <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Truck className="w-4 h-4" />,    text: 'Free Delivery', sub: 'Over $100' },
              { icon: <Shield className="w-4 h-4" />,   text: 'Secure Pay',    sub: 'Paystack'  },
              { icon: <RotateCcw className="w-4 h-4" />,text: 'Easy Returns',  sub: '30 days'   },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-xl text-center">
                <span className="text-brand-400">{b.icon}</span>
                <span className="text-xs font-medium text-white">{b.text}</span>
                <span className="text-xs text-slate-500">{b.sub}</span>
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="pt-2 space-y-1.5 text-sm">
            <p className="text-slate-500">SKU: <span className="text-slate-300">{product.sku || `SKU-${product.id}`}</span></p>
            <p className="text-slate-500">Warranty: <span className="text-slate-300">{product.warrantyInformation || '1 Year'}</span></p>
            <p className="text-slate-500">Shipping: <span className="text-slate-300">{product.shippingInformation || '2–5 business days'}</span></p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mb-16">
        <div className="flex gap-1 border-b border-white/10 mb-8">
          {['description', 'reviews', 'shipping'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn('px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
                activeTab === tab ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-500 hover:text-white')}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div>
            <p className="text-slate-400 leading-relaxed">{product.description}</p>
            {product.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-400">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {product.reviews?.length ? product.reviews.map((r, i) => (
              <div key={i} className="card-dark p-5 rounded-2xl border border-white/8">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{r.reviewerName}</p>
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star key={j} className={cn('w-3 h-3', j < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700')} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-600">{new Date(r.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-400">{r.comment}</p>
              </div>
            )) : <p className="text-slate-500 text-center py-8">No reviews yet.</p>}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            {[
              { icon: <Truck className="w-4 h-4" />,    title: 'Delivery', text: product.shippingInformation || 'Standard: 2–5 days. Express: 1–2 days.' },
              { icon: <RotateCcw className="w-4 h-4" />, title: 'Returns',  text: product.returnPolicy || '30-day hassle-free returns. Items must be unused in original packaging.' },
            ].map(b => (
              <div key={b.title} className="card-dark p-5 rounded-2xl border border-white/8">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2 text-brand-400">{b.icon} <span className="text-white">{b.title}</span></h4>
                <p className="text-sm text-slate-400">{b.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related?.length > 0 && (
        <section>
          <h2 className="section-title mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}