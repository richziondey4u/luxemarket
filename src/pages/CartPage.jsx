import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../api/products.js'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, tax, total, isEmpty } = useCart()

  if (isEmpty) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
        <ShoppingBag className="w-12 h-12 text-slate-600" />
      </div>
      <h2 className="font-display text-3xl font-bold text-white mb-3">Your cart is empty</h2>
      <p className="text-slate-500 mb-8 max-w-sm">Looks like you haven't added anything yet. Start shopping!</p>
      <Link to="/" className="btn-primary gap-2 text-base px-8 py-3.5 rounded-2xl">
        Browse Products <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-bold text-white mb-8">
        Shopping Cart
        <span className="text-slate-600 text-2xl ml-3 font-normal">({items.length} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.key} className="card-dark rounded-2xl p-5 border border-white/8 flex gap-4 hover:border-white/15 transition-colors">
              <Link to={`/product/${item.id}`} className="flex-shrink-0">
                <img src={item.product.thumbnail} alt={item.product.title} className="w-24 h-24 rounded-xl object-cover bg-slate-800" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{item.product.brand || item.product.category}</p>
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-sm font-medium text-slate-200 hover:text-brand-400 transition-colors leading-snug">{item.product.title}</h3>
                    </Link>
                  </div>
                  <button onClick={() => removeItem(item.key)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-white font-semibold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="price-tag text-base">{formatPrice(item.product.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-xs text-slate-500">{formatPrice(item.product.price)} each</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-400 transition-colors pt-2">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card-dark rounded-2xl p-5 border border-white/8">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-brand-400" /> Promo Code
            </h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Enter code" className="input-field text-sm py-2" />
              <button className="btn-outline text-sm py-2 px-4 whitespace-nowrap">Apply</button>
            </div>
          </div>

          <div className="card-dark rounded-2xl p-6 border border-white/8 sticky top-24">
            <h3 className="font-display text-xl font-bold text-white mb-5">Order Summary</h3>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className={shipping === 0 ? 'text-brand-400 font-medium' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tax (7.5%)</span>
                <span className="text-white">{formatPrice(tax)}</span>
              </div>
              {shipping > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  <p className="text-xs text-amber-400">Add {formatPrice(100 - subtotal)} more for free shipping!</p>
                </div>
              )}
            </div>
            <div className="border-t border-white/10 pt-4 mb-5">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="font-display text-2xl font-bold text-brand-400">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full gap-2 py-3.5 rounded-2xl text-base">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-3 mt-4">
              {['Paystack', 'Visa', 'MC'].map(p => (
                <span key={p} className="text-xs text-slate-600 font-mono bg-white/5 px-2 py-1 rounded border border-white/8">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}